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
import { NostrConnectionContext } from "@/context/use-nostr-connection";
import { set } from "superstruct";


interface Props {
  currentOpenContact: string;
}

export default function MessagesContainer({ currentOpenContact }: Props) {
  useEffect(() => {
    if (typeof window !== 'undefined') {
      // Code that runs on the client-side
      console.log('MC Running on the client-side');
    } else {
      // Code that runs on the server-side
      console.log('MC Running on the server-side');
    }
  }, []);

  const { relayPool } = useRelayPool();
  const [msgInput, setMsgInput] = useState("");
  const [messages, setMessages] = useState<Event[]>([]);
  const [name, setName] = useState<string>("Loading ...");
  const [image, setImage] = useState<string>("Loading ...");
  const { connection:
    decryptMessage,
    encryptMessage,
    signEvent
  } = useNostrConnection();

  const { connection: nostrConnection } = useNostrConnection();
  //const result = useContext(NostrConnectionContext);
  const [myPubkey, setNostrPubKey] = useState<string>("");
  const pubkeysToFetch = useMemo(
    () => [currentOpenContact],
    [currentOpenContact]
  );

  const { metadata } = useMetadata({ pubkeys: pubkeysToFetch });

  useEffect(() => {
    if (!nostrConnection) return;
    setNostrPubKey(nostrConnection.pubkey);
    // if (result?.connection?.pubkey !== null) {
    //   setNostrPubKey(result?.connection?.pubkey!);
    // }
  }, [nostrConnection]);

  useEffect(() => {
    setName(getProfileDataFromMetaData(metadata, myPubkey).name)
    setImage(getProfileDataFromMetaData(metadata, myPubkey).image)
  }, [myPubkey, metadata]);

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
      <div className="flex flex-col flex-auto h-full p-6">
        {currentOpenContact && (
          <div className="flex flex-row items-center space-x-6">
            <div className="h-20 w-20 rounded-full border overflow-hidden">
              <img
                src={image}
                alt=""
                className="h-full w-full"
              />
            </div>
            <div className="text-white overflow-x-auto whitespace-nowrap">
              <p className="overflow-hidden text-overflow-ellipsis">
                {name}
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
        <div className="h-screen h-80 bg-gray-200 overflow-y-scroll rounded-md">
          <div className="flex flex-col-reverse bg-gray-200 grow gap-8 py-16">
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
      </div>
      {/* {currentOpenContact && (
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
      )} */}
      {currentOpenContact && (
        <form onSubmit={sendMessage} className="flex flex-row items-center h-16 rounded-xl bg-white w-full px-4">
          <div>
            <button className="flex items-center justify-center text-gray-400 hover:text-gray-600">
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13"
                />
              </svg>
            </button>
          </div>
          <div className="flex-grow ml-4">
            <div className="relative w-full">
              <input
                type="text"
                value={msgInput}
                className="flex w-full border rounded-xl focus:outline-none focus:border-indigo-300 pl-4 h-10"
                onChange={(e) => setMsgInput(e.target.value)}
              />
              <button type="button" className="absolute flex items-center justify-center h-full w-12 right-0 top-0 text-gray-400 hover:text-gray-600">
                <svg
                  className="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </button>
            </div>
          </div>
          <div className="ml-4">
            <button type="submit" className="flex items-center justify-center bg-indigo-500 hover:bg-indigo-600 rounded-xl text-white px-4 py-1 flex-shrink-0">
              <span>Send</span>
              <span className="ml-2">
                <svg
                  className="w-4 h-4 transform rotate-45 -mt-px"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"
                  />
                </svg>
              </span>
            </button>
          </div>
        </form>
      )}
    </>
  );
}