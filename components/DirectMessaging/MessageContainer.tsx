import { Event, UnsignedEvent, getEventHash } from "nostr-tools";
import React, { useContext, useEffect, useMemo, useState } from "react";
import CopyToClipboard from "react-copy-to-clipboard";
import { getProfileDataFromMetaData } from "../../context/helperFunctions";
import { Relays } from "../../context/relays";
import { useMetadata } from "../../context/use-metadata";
import { useNostrConnection } from "../../context/use-nostr-connection";
import { useRelayPool } from "../../context/use-relays-pool";
import { insertEventIntoDescendingList } from "../../context/helperFunctions";
import { DecryptionQueue } from "@/context/decryptionQueue";
import { NostrConnectionContext, NostrAccountConnection } from "@/context/use-nostr-connection";


interface Props {
  currentOpenContact: string;
}

export default function MessagesContainer({ currentOpenContact }: Props) {
  const { relayPool } = useRelayPool();
  const [msgInput, setMsgInput] = useState("");
  const [messages, setMessages] = useState<Event[]>([]);


  const { connection:
    //nostrConnection,
    decryptMessage,
    encryptMessage,
    signEvent
  } = useNostrConnection();

  //const myPubkey = nostrConnection?.pubkey;

  const result = useContext(NostrConnectionContext);
  let myPubkey: string = "";

  if (result?.connection?.pubkey !== null) {
    myPubkey = result?.connection?.pubkey!;
  } else {
    throw new Error("Nostr Connection not found");
  }


  const pubkeysToFetch = useMemo(
    () => [currentOpenContact],
    [currentOpenContact]
  );

  const { metadata } = useMetadata({ pubkeys: pubkeysToFetch });

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

    const onEvent = async (event: Event) => {
      DecryptionQueue.add(event.content, currentOpenContact, (err, msg) => {
        if (err) {
          return console.log(err);
        }

        const decryptedEvent = {
          ...event,
          content: msg,
        } as Event;
        setMessages((messages) =>
          insertEventIntoDescendingList(messages, decryptedEvent)
        );
      });
    };

    sub.on("event", onEvent)
  }, [currentOpenContact, myPubkey, relayPool]);

  const sendMessage = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const encryptedContent = await encryptMessage(
        msgInput,
        currentOpenContact
      );
      // create event to publish
      // // encrypt content
      // // sign event

      const _baseEvent = {
        content: encryptedContent,
        created_at: Math.round(Date.now() / 1000),
        kind: 4,
        tags: [["p", currentOpenContact]],
        pubkey: myPubkey,
      } as UnsignedEvent;

      const event = {
        ..._baseEvent,
        sig: await signEvent(_baseEvent),
        id: getEventHash(_baseEvent),
      } as Event;

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
      <div className="grow flex flex-col bg-gray-800 rounded-md">
        {currentOpenContact && (
          <div className=" bg-gray-900 p-24 overflow-hidden text-ellipsis flex items-center">
            <img
              src={
                getProfileDataFromMetaData(metadata, currentOpenContact).image
              }
              className="rounded-full w-42 h-42 mr-16 bg-gray-300 border border-gray-400"
              alt=""
            />{" "}
            <div className="text-white">
              <p>
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
              className={`flex flex-col gap-4 rounded-24 px-16 py-8 ${message.pubkey === myPubkey
                ? "place-self-end" : "place-self-start"} space-y-1`}
            >
              <div className={`bg-white p-5 rounded-2xl ${message.pubkey === myPubkey ? "bg-green-100" : ""}`}>
                <p className="text-body3">{message.content}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
      {currentOpenContact && (
        <form onSubmit={sendMessage} className="flex w-full gap-10">
          <input
            className="input input-bordered input-accent w-full max-w-xs rounded-md"
            type="text"
            placeholder="   Type your message here..."
            value={msgInput}
            onChange={(e) => setMsgInput(e.target.value)}
          />
          <button className="bg-violet-500 text-body3 px-16 py-4 shrink-0 rounded-md font-bold hover:bg-violet-600 active:scale-90">
            Send Message 📧
          </button>
        </form>
      )}
    </>
  );
}