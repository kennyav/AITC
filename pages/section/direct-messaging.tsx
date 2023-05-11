"use client";

import { useContext, useState } from "react";
import { useNostrConnection } from "../../context/use-nostr-connection";
import ContactsList from "../../components/DirectMessaging/ContactList";
import MessagesContainer from "../../components/DirectMessaging/MessageContainer";
import UserSideMenu from "@/components/UserSideMenu";
import { NostrConnectionContext } from "@/context/use-nostr-connection";
import styles from '../../styles/Home.module.css'
import AccountButton from "@/components/AccountButton";

export default function DirectMessaging() {
  const { connection: nostrConnection } = useNostrConnection();

  const [currentOpenContact, setCurrentOpenContact] = useState("");
  const result = useContext(NostrConnectionContext);
  let nostrPubKey = null;

  if (result?.connection?.pubkey !== null) {
    nostrPubKey = result?.connection?.pubkey!;
  } else {
    throw new Error("Nostr Connection not found");
  }

  return (
    <div>
      <AccountButton pubkey={nostrPubKey}/>
      <div className="min-w-screen min-h-screen">
        <div className="grid gap-6 grid-cols-3">
          <div className="col-span-1 w-full h-screen">
            <ContactsList
              pubkey={nostrPubKey!}
              currentOpenContact={currentOpenContact}
              onOpenContact={setCurrentOpenContact}
            />
          </div>
          <div className="col-span-2 h-screen bg-gray-900 bg-opacity-30 rounded p-16 flex flex-col ">
            <MessagesContainer
              key={currentOpenContact}
              currentOpenContact={currentOpenContact}
            />
          </div>
        </div>
      </div>
      <UserSideMenu isOpen={false} />
    </div>
  );
}