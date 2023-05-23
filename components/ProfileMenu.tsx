import Link from "next/link";
import { useEffect, useState } from "react";
import { nip19 } from "nostr-tools";
import { shortenHash } from "../lib/utils";
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

  const handleClose = () => {
    toggleMenu(false);
  }

  return (
    <div className="flex flex-col absolute right-4 -bottom-16 translate-y-full">
      <div className="h-full rounded-md px-2 py-2 overflow-y-auto bg-gray-50 dark:bg-gray-800">
        <ul className="space-y-2">
          <li>
            <Link href={'#'} className="flex w-full items-center p-2 text-base font-normal text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700">
              <svg aria-hidden="true" className="w-6 h-6 text-gray-500 transition duration-75 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                <path clipRule="evenodd" fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-5.5-2.5a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0zM10 12a5.99 5.99 0 00-4.793 2.39A6.483 6.483 0 0010 16.5a6.483 6.483 0 004.793-2.11A5.99 5.99 0 0010 12z" />
              </svg>
              <span className="ml-3">Profile</span>
            </Link>
          </li>
          <li>
            <Link
              href="#"
              className="flex w-full items-center p-2 text-base font-normal text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700"
            >
              <svg aria-hidden="true" className="w-6 h-6 text-gray-500 transition duration-75 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                <path d="M14.5 10a4.5 4.5 0 004.284-5.882c-.105-.324-.51-.391-.752-.15L15.34 6.66a.454.454 0 01-.493.11 3.01 3.01 0 01-1.618-1.616.455.455 0 01.11-.494l2.694-2.692c.24-.241.174-.647-.15-.752a4.5 4.5 0 00-5.873 4.575c.055.873-.128 1.808-.8 2.368l-7.23 6.024a2.724 2.724 0 103.837 3.837l6.024-7.23c.56-.672 1.495-.855 2.368-.8.096.007.193.01.291.01zM5 16a1 1 0 11-2 0 1 1 0 012 0z" />
                <path d="M14.5 11.5c.173 0 .345-.007.514-.022l3.754 3.754a2.5 2.5 0 01-3.536 3.536l-4.41-4.41 2.172-2.607c.052-.063.147-.138.342-.196.202-.06.469-.087.777-.067.128.008.257.012.387.012zM6 4.586l2.33 2.33a.452.452 0 01-.08.09L6.8 8.214 4.586 6H3.309a.5.5 0 01-.447-.276l-1.7-3.402a.5.5 0 01.093-.577l.49-.49a.5.5 0 01.577-.094l3.402 1.7A.5.5 0 016 3.31v1.277z" />
              </svg>
              <span className="ml-3">Settings</span>
            </Link>
          </li>
          <li>
            <button
              className="flex w-full items-center p-2 text-base font-normal text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700"
              onClick={handleSignOut}
            >
              <svg aria-hidden="true" className="w-6 h-6 text-gray-500 transition duration-75 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                <path clipRule="evenodd" fillRule="evenodd" d="M3 3a1 1 0 00-1 1v12a1 1 0 102 0V4a1 1 0 00-1-1zm10.293 9.293a1 1 0 001.414 1.414l3-3a1 1 0 000-1.414l-3-3a1 1 0 10-1.414 1.414L14.586 9H7a1 1 0 100 2h7.586l-1.293 1.293z" />
              </svg>
              <div className="flex flex-col ml-3 text-left">
                <span>{shortenHash(name, 4)}</span>
                <span>Sign out</span>
              </div>
            </button>
          </li>
          <li>
            <button
              className="flex w-full items-center p-2 text-base font-normal text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700"
              onClick={handleClose}
            >
              <svg aria-hidden="true" className="flex-shrink-0 w-6 h-6 text-gray-500 transition duration-75 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-2 0c0 .993-.241 1.929-.668 2.754l-1.524-1.525a3.997 3.997 0 00.078-2.183l1.562-1.562C15.802 8.249 16 9.1 16 10zm-5.165 3.913l1.58 1.58A5.98 5.98 0 0110 16a5.976 5.976 0 01-2.516-.552l1.562-1.562a4.006 4.006 0 001.789.027zm-4.677-2.796a4.002 4.002 0 01-.041-2.08l-.08.08-1.53-1.533A5.98 5.98 0 004 10c0 .954.223 1.856.619 2.657l1.54-1.54zm1.088-6.45A5.974 5.974 0 0110 4c.954 0 1.856.223 2.657.619l-1.54 1.54a4.002 4.002 0 00-2.346.033L7.246 4.668zM12 10a2 2 0 11-4 0 2 2 0 014 0z" clipRule="evenodd"></path>
              </svg>
              <span className="ml-3">Close Menu</span>
            </button>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default ProfileMenu;