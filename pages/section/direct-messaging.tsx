import { useContext, useEffect, useState } from "react";
import { useNostrConnection } from "../../context/use-nostr-connection";
import ContactsList from "../../components/DirectMessaging/ContactList";
import MessagesContainer from "../../components/DirectMessaging/MessageContainer";
import UserSideMenu from "@/components/UserSideMenu";
import AccountButton from "@/components/AccountButton";
import { NostrConnectionContext } from "@/context/use-nostr-connection";

export default function DirectMessaging() {
  useEffect(() => {
    if (typeof window !== 'undefined') {
      // Code that runs on the client-side
      console.log('Running on the client-side');
    } else {
      // Code that runs on the server-side
      console.log('Running on the server-side');
    }
  }, []);

  const { connection: nostrConnection } = useNostrConnection();
  const [currentOpenContact, setCurrentOpenContact] = useState("");
  const [nostrPubKey, setNostrPubKey] = useState<string>("");
  //const result = useContext(NostrConnectionContext);


  useEffect(() => {
    if (!nostrConnection) return;
    setNostrPubKey(nostrConnection.pubkey);
    
    // if (result?.connection?.pubkey !== null) {
    //   setNostrPubKey(result?.connection?.pubkey!);
    // }
  }, [nostrConnection]);

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