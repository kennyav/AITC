import { useContext, useState } from "react";
import { useNostrConnection } from "../../context/use-nostr-connection";
import ContactsList from "../../components/DirectMessaging/ContactList";
import MessagesContainer from "../../components/DirectMessaging/MessageContainer";
import UserSideMenu from "@/components/UserSideMenu";
import { NostrConnectionContext } from "@/context/use-nostr-connection";

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
      <div className="max-w-[130ch] mx-auto px-16">
        <h1 className="text-h1 font-bolder text-violet-509">Direct Messaging</h1>
        <div className="grid gap-16 grid-cols-3">
          <div className="col-span-1">
            <p className="text-body1 mb-24">My Contacts</p>
            <ContactsList
              pubkey={nostrPubKey!}
              currentOpenContact={currentOpenContact}
              onOpenContact={setCurrentOpenContact}
            />
          </div>
          <div className="col-span-2 h-[min(60vh,800px)] bg-gray-900 bg-opacity-30 rounded p-16 flex flex-col ">
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