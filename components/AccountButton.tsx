import { useState } from "react";
import Button from "./Button";
import ProfileMenu from "./ProfileMenu";
import { useMetadata } from "../context/use-metadata";
import { getProfileDataFromMetaData } from "../context/helperFunctions";

interface AccountButtonProps {
  pubkey: string;
}

export default function AccountButton({ pubkey }: AccountButtonProps) {
  const [showMenu, setShowMenu] = useState(false);
  const { metadata } = useMetadata({ pubkey });

  console.log("Account Button Public Key", pubkey)
  console.log("Account Button Profile Name", getProfileDataFromMetaData(metadata, pubkey).name)

  // get current date and time
  const now = new Date();

  return (
    <div className="relative">
      <div className="relative">
        <div className="absolute top-4 right-4 flex items-center space-x-4">
          <div className="font-medium dark:text-white text-right">
            <div>{getProfileDataFromMetaData(metadata, pubkey).name}</div>
            <div className="text-sm text-gray-500 dark:text-gray-400">AITC {now.toISOString().slice(0, 10)} </div>
          </div>
          <Button
            color="transparent"
            variant="ghost"
            size="xs"
            className="flex items-center gap-2 text-gray hover:text-gray-hover p-0"
            onClick={() => setShowMenu((currrent) => !currrent)}
          >
            <span className="rounded-full">
              <img
                src={getProfileDataFromMetaData(metadata, pubkey).image}
                className="rounded-full w-8 h-8 object-cover"
                alt=""
              />
            </span>
          </Button>
        </div>
      </div>
      {showMenu && <ProfileMenu toggleMenu={setShowMenu} pubkey={pubkey} />}
    </div>
  );
}