import React, { useEffect, useState } from 'react'
import {
  getEventHash,
  UnsignedEvent,
  generatePrivateKey,
  getPublicKey,
  signEvent,
  Event,
} from "nostr-tools";
import NostrImg from '@/context/upload/Nostrimg';
import { NostrAccountConnection, useNostrConnection } from '@/context/use-nostr-connection';
import { useRelayPool } from '@/context/use-relays-pool';
import { Relays } from '@/context/relays';
import { useRouter } from "next/navigation";
import { useDispatch } from 'react-redux';
import { toggleConnectState } from '@/globalRedux/features/connectSlice';

interface Metadata {
  name?: string;
  about?: string;
  picture?: string;
  nip05?: string;
  lud06?: string;
}

export default function CreateAccount() {

  const { relayPool } = useRelayPool();
  const { connection: nostrConnection, setConnection } = useNostrConnection();
  const [metadata, setMetadata] = useState<Metadata>({});
  const [privKey, setPrivKey] = useState<string>("");
  const router = useRouter();
  const dispatch = useDispatch();

  const handleGenerateKey = () => {
    setPrivKey(generatePrivateKey());
  }

  async function handleImageSelection(e: any) {
    const selectedImage = e.target.files[0];
    const image = await NostrImg(selectedImage);
    setMetadata({ ...metadata, picture: image.url });
  }

  // create a generated keys nostr account connection object
  const clickConnect = async (e: any, type: "generated-keys") => {
    e.preventDefault();
    
    let connectionObject: NostrAccountConnection;
    console.log("click connect");
    try {
      if (type === "generated-keys")
        connectionObject = connectGeneratedKeys();
      else throw new Error("Invalid tab");

      // setting the connection based on what type of login we use
      setConnection(connectionObject);

    } catch (error) {
      console.log(error);
      alert("Something wrong happened");
    }
  }

  // handle if the user presses generate key
  const connectGeneratedKeys = () => {
    if (!privKey) throw new Error("Failed to generate private key");
    console.log("click connect 2");

    const pubKey = getPublicKey(privKey);
    return {
      type: "generated-keys",
      prvkey: privKey,
      pubkey: pubKey,
    } as NostrAccountConnection;
  }

  // TODO: add a check to see if the user has inputted all the required fields

  // when the nostrconnection is set we will then send the metadata to the blockchain
 useEffect(() => {
    if (!nostrConnection) return;
    console.log("Metadata", JSON.stringify(metadata));

    // base event for the metadata
    const _baseEvent = {
      kind: 0,
      created_at: Math.floor(Date.now() / 1000),
      tags: [],
      content: JSON.stringify(metadata),
      pubkey: nostrConnection.pubkey,
    } as UnsignedEvent;

    try {
      if (!nostrConnection || nostrConnection.type === "nostr-ext" || nostrConnection.type === "nostr-connect") return;
      const _event = {
        ..._baseEvent,
        sig: signEvent(_baseEvent, nostrConnection.prvkey),
        id: getEventHash(_baseEvent),
      } as Event;

      if (!relayPool) return;
      const pubs = relayPool.publish(Relays.getRelays(), _event);

      pubs.on("ok", () => {
        console.log("Metadata published");
        // when the publish is good then when set the user to login true and send them to the main page
        dispatch(toggleConnectState(true));
        router.push("/");
      });
    } catch (error) {
      console.log(error);
      alert("Metadata failed to be published");
    }
  }, [nostrConnection]);


  return (
    <section>
      <div className="flex flex-row items-center justify-center px-6 py-8 mx-auto md:h-screen lg:py-0">
        <div className="w-full rounded-lg shadow dark:border md:mt-0 sm:max-w-md xl:p-0 dark:bg-gray-800 dark:border-gray-700">
          <div className="p-6 space-y-4 md:space-y-6 sm:p-8">
            <h1 className="text-2xl font-semibold text-gray-700 dark:text-white">Create Account</h1>
            <form className="mt-8 space-y-6" onSubmit={(e) => clickConnect(e, "generated-keys")}>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-200">
                Account Name
              </label>
              <input
                type="text"
                className="rounded-lg shadow-sm p-1"
                placeholder='input account name ...'
                onChange={(e) => setMetadata({ ...metadata, name: e.target.value })}
                value={metadata.name}
              />
              <input
                type="text"
                className="rounded-lg shadow-sm p-1"
                value={metadata.picture}
                readOnly
              />
              <input
                type="file"
                id="image-input"
                accept="image/*"
                onChange={handleImageSelection}
                className="hidden"
              />
              <label
                className="cursor-pointer font-medium hover:bg-gray-200 text-white py-2 px-4 rounded-lg"
                htmlFor="image-input"
              >
                Picture
              </label>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-200">
                Description (optional)
              </label>
              <textarea
                className="rounded-lg shadow-sm p-1"
                placeholder="input profile description ..."
                onChange={(e) => setMetadata({ ...metadata, about: e.target.value })}
              />
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-200">
                Private Key
              </label>
              <div className="flex flex-row">
                <input
                  type="text"
                  className="rounded-lg shadow-sm p-1"
                  value={privKey}
                  readOnly />
                <button type="button" className="font-medium hover:bg-gray-200 text-white py-2 px-4 rounded-lg" onClick={handleGenerateKey}>
                  Generate
                </button>
              </div>
              <div className="flex flex-row justify-bewteen items-center">
                <button type="button" className="text-white text-left font-medium text-xl hover:bg-gray-400 rounded-lg p-2"
                onClick={() => router.push("/section/login")}>
                  Back
                </button>
                <button type="submit" className="text-white text-left font-medium text-xl hover:bg-gray-400 rounded-lg p-2">
                  Create Account
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </section>
  )
}
