import Link, { LinkProps } from "next/link";
import { DetailedHTMLProps, Fragment, HTMLAttributes, use, useEffect, useState } from "react";
import { nip19 } from "nostr-tools";
import { shortenHash } from "../lib/utils";
import { User, IconType, Bookmark } from "../icons";
import { useRouter } from "next/navigation";
import { useNostrConnection } from "@/context/use-nostr-connection";
import { useDispatch } from "react-redux";
import { toggleConnectState } from '@/globalRedux/features/connectSlice';


interface ProfileMenuProps {
  pubkey: string;
  toggleMenu: (show: boolean) => void;
}

const ProfileMenu: React.FC<ProfileMenuProps> = ({ pubkey, toggleMenu }) => {
  const { setConnection } = useNostrConnection();
  const [npub, setNpub] = useState<string>();
  const dispatch = useDispatch();

  useEffect(() => {
    setNpub(nip19.npubEncode(pubkey));
  }, []);


  const router = useRouter();
  let name = npub ? npub : "Loading ...";


  const handleSignOut = () => {
    dispatch(toggleConnectState(true));
    router.push('/section/login');
    setConnection(null);
    window.localStorage.removeItem('nostr-connection');
  };

  const handleProfile = () => {
    toggleMenu(false);
    router.push('/section/profile');
  }

  return (
    <Fragment>
      <div className="flex flex-col rounded-md bg-blue-200 shadow-profile-menu border border-light-gray absolute z-40 right-0 -bottom-4 translate-y-full text-sm min-w-max">
        <GroupMenu>
          {/* <Item
            onClick={() => handleProfile()}
            label="Profile"
            href={`/u/` + npub}
            Icon={User}
          /> */}
          <Item
            onClick={() => toggleMenu(false)}
            label="Bookmark"
            href={`/u/` + name}
            Icon={Bookmark}
          />
        </GroupMenu>
        <GroupMenu>
          <Item
            onClick={() => toggleMenu(false)}
            label="Settings"
            href="/settings"
          />
        </GroupMenu>
        <GroupMenu>
          <button
            className="px-6 py-2 cursor-pointer text-gray group flex flex-col gap-2 items-start"
            onClick={handleSignOut}
          >
            <span className="group-hover:text-gray-hover">Sign out</span>
            <span>{shortenHash(name, 12)}</span>
          </button>
        </GroupMenu>
      </div>
      <div className="fixed inset-0 z-30" onClick={() => toggleMenu(false)} />
    </Fragment>
  );
};

interface ItemProps extends LinkProps {
  label: string;
  href: string;
  className?: string;
  Icon?: IconType;
}

const Item: React.FC<ItemProps> = ({
  label,
  href,
  Icon,
  className = "",
  ...props
}) => (
  <Link
    href={href}
    className={`flex items-center px-6 py-2 gap-4 cursor-pointer text-gray hover:text-gray-hover ${className}`}
    {...props}
  >
    {Icon ? <Icon size="20" /> : null}
    <span>{label}</span>
  </Link>
);

interface GroupMenuProps
  extends DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement> { }

const GroupMenu: React.FC<GroupMenuProps> = ({
  className = "",
  children,
  ...props
}) => (
  <div className={`py-4 border-b border-b-light-gray ${className}`} {...props}>
    {children}
  </div>
);

export default ProfileMenu;