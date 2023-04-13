import { Event } from "nostr-tools";
import React, { useContext, useEffect, useMemo, useState } from "react";
import CopyToClipboard from "react-copy-to-clipboard";
import { getProfileDataFromMetaData } from "../../context/helperFunctions";
import { Relays } from "../../context/relays";
import { useMetadata } from "../../context/use-metadata";
import { useNostrConnection } from "../../context/use-nostr-connection";
import { useRelayPool } from "../../context/use-relays-pool";
import { KeysContext } from "@/context/keys-provider";

interface Props {
  currentOpenContact: string;
}

export default function MessagesContainer({ currentOpenContact }: Props) {
  const { relayPool } = useRelayPool();

  const [msgInput, setMsgInput] = useState("");

  const [messages, setMessages] = useState<Event[]>([]);

  const { connection: nostrConnection } = useNostrConnection();

  // TODO: implement the nostrConnection to the rest of the application
  //const myPubkey = nostrConnection?.pubkey;

  // for now we will use our basic key storage from keys-provider
  // @ts-ignore
  const { keys } = useContext(KeysContext);
  const myPubkey = keys.pubkey;
  

  const pubkeysToFetch = useMemo(
    () => [currentOpenContact],
    [currentOpenContact]
  );

  const { metadata } = useMetadata({ pubkeys: pubkeysToFetch });

  if (!myPubkey) throw new Error("Nostr Connection not found");

  useEffect(() => {
    if (!relayPool) return;

    // Create Subscription
    const sub = relayPool.sub(Relays.getRelays(), [
      // to get all of the encrypted messages that we have sent to the current contact
      {
         kinds: [4],
         authors: [myPubkey],
         "#p": [currentOpenContact],
         limit: 100,
      },
       // to get all of the encrypted messages that our current contact has sent to us
      {
         kinds: [4],
         authors: [currentOpenContact],
         "#p": [myPubkey],
         limit: 100,
      }
    ])
    
    const onEvent = (event: Event) => {
      console.log(event)
    }

    sub.on("event", onEvent)

    // on event received:
    // - decrypt event
    // - add event to sorted list
    // (use queue)
  }, [currentOpenContact, myPubkey, relayPool]);

  const sendMessage = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      // create event to publish
      // // encrypt content
      // // sign event

      const event = {} as Event;
      const pubs = relayPool!.publish(Relays.getRelays(), event);

      let clearedInput = false;

      pubs.on("ok", () => {
        if (clearedInput) return;

        clearedInput = true;
        setMsgInput("");
      });
    } catch (error) {
      console.log(error);

      alert("User rejected operation");
    }
  };

  return (
    <>
      <div className="grow flex flex-col">
        {currentOpenContact && (
          <div className=" bg-gray-900 p-24 overflow-hidden text-ellipsis flex items-center">
            <img
              src={
                getProfileDataFromMetaData(metadata, currentOpenContact).image
              }
              className="rounded-full w-42 h-42 mr-16 bg-gray-300 border border-gray-400"
              alt=""
            />{" "}
            <div>
              <p className="text-body3 font-bold ">
                {getProfileDataFromMetaData(metadata, currentOpenContact).name}
              </p>
              <CopyToClipboard
                text={currentOpenContact}
                onCopy={() => alert("Copied public key!")}
              >
                <button className="">
                  {currentOpenContact.slice(0, 15)}...
                </button>
              </CopyToClipboard>
            </div>
          </div>
        )}
        <div className="flex flex-col-reverse grow gap-8 py-16">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex flex-col gap-4 rounded-24 px-16 py-8 ${
                message.pubkey === myPubkey
                  ? "self-start bg-gradient-to-br from-indigo-500 via-purple-500 to-purple-600 "
                  : "self-end bg-gray-700"
              }`}
            >
              <p className="text-body3">{message.content}</p>
            </div>
          ))}
        </div>
      </div>
      {currentOpenContact && (
        <form onSubmit={sendMessage} className="flex w-full gap-16">
          <input
            className="grow p-16"
            type="text"
            placeholder="Type your message here..."
            value={msgInput}
            onChange={(e) => setMsgInput(e.target.value)}
          />
          <button className="bg-violet-500 text-body3 px-16 py-4 shrink-0 rounded-8 font-bold hover:bg-violet-600 active:scale-90">
            Send Message 📧
          </button>
        </form>
      )}
    </>
  );
}