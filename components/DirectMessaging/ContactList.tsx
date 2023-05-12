import { nip19 } from "nostr-tools";
import React, { useEffect, useMemo, useState } from "react";
import { useStatePersist } from "use-state-persist";
import { getProfileDataFromMetaData, usePersistState } from "../../context/helperFunctions";
import { useMetadata } from "../../context/use-metadata";
import styles from '../../styles/Home.module.css'
import CopyToClipboard from "react-copy-to-clipboard";

interface Props {
  pubkey: string;
  currentOpenContact: string;
  onOpenContact?: (pubkey: string) => void;
}

export default function ContactsList({ pubkey, currentOpenContact, onOpenContact }: Props) {
  useEffect(() => {
    if (typeof window !== 'undefined') {
      // Code that runs on the client-side
      console.log('CL Running on the client-side');
    } else {
      // Code that runs on the server-side
      console.log('CL Running on the server-side');
    }
  }, []);

  // const [contacts, setContacts] = useStatePersist<Contact[]>(
  //   `contacts:${pubkey}`,
  //   [],
  // );

  const [contacts, setContacts] = usePersistState<Contact[]>(
    `contacts:${pubkey}`,
    [],
  );

  const pubkeysToFetch = useMemo(
    () => contacts.map((contact) => contact.pubkey),
    [contacts]
  );

  const { metadata } = useMetadata({ pubkeys: pubkeysToFetch });
  const [newContact, setNewContact] = React.useState("");
  const [name, setName] = useState<string>("Loading ...");
  const [image, setImage] = useState<string>("Loading ...");

  useEffect(() => {
    setName(getProfileDataFromMetaData(metadata, pubkey).name)
    setImage(getProfileDataFromMetaData(metadata, pubkey).image)
  }, [pubkey, metadata]);

  let hexPubkey = newContact;

  useEffect(() => {
    if (newContact.startsWith("npub"))
      hexPubkey = nip19.decode(newContact).data as string;
  }, []);


  function onAddContact(e: React.FormEvent) {
    e.preventDefault();
    if (!newContact) return;

    setContacts((contacts) => {
      if (contacts.find((contact) => contact.pubkey === hexPubkey))
        return contacts;
      const newContacts = [...contacts, { pubkey: hexPubkey }];
      return newContacts;
    });
    onOpenContact?.(hexPubkey);

    setNewContact("");
  }

  return (
    <div className="flex flex-col py-8 pl-4 pr-3 w-full h-screen bg-white flex-shrink-0 rounded-lg">
      <div className="flex flex-row items-center h-12 w-full text-left">
        <div className={`${styles.testFont} text-xl`}>AITC CHAT</div>
      </div>
      <div className="flex flex-col items-center bg-[#0f172a] border border-gray-200 mt-4 w-full py-6 px-4 rounded-lg">
        <div className="h-20 w-20 rounded-full border overflow-hidden">
          <img
            src={image}
            alt="Avatar"
            className="h-full w-full"
          />
        </div>
        <div className="w-3/4 overflow-hidden text-sm text-white font-semibold mt-2 text-left">
          <CopyToClipboard
            text={pubkey}
            onCopy={() => alert("Copied public key!")}
          >
            <button className="overflow-hidden w-full">
              <p className="truncate">{name}</p>
            </button>
          </CopyToClipboard>
        </div>
      </div>
      <div className="flex flex-col mt-8">
        <div className="flex flex-row items-center justify-between text-xs">
          {contacts.length === 0 ? (
            <span className={`${styles.testFont}`}>No contacts yet</span>
          ) :
            (
              <div className="flex flex-row items-center justify-between text-xs space-x-20">
                <span className={`${styles.testFont}`}>Active Conversations</span>
                <span className="flex items-center justify-center bg-gray-300 h-4 w-4 rounded-full">
                  {contacts.length}
                </span>
              </div>
            )}
        </div>
        {contacts.length > 0 && (
          <div className="overflow-y-scroll overflow-x-hidden h-60">
            <ul>
              {contacts.map((contact, i) => {
                const profileData = getProfileDataFromMetaData(
                  metadata,
                  contact.pubkey
                );
                return (
                  <li key={i}>
                    <div className="flex flex-col mt-4 -mx-2 h-20">
                      <button className="flex flex-row items-center hover:bg-gray-100 rounded-xl p-2" onClick={() => onOpenContact?.(contact.pubkey)}>
                        <img className="h-10 w-10 rounded-full border" src={profileData.image} alt="" />
                        <div className="flex flex-col text-left truncate">
                          <div className="ml-2 text-sm font-semibold">{profileData.name}</div>
                          <div className="ml-2 text-sm font-semibold truncate">{profileData.pubkey}</div>
                        </div>
                      </button>
                    </div>
                  </li>
                )
              })}
            </ul>
          </div>
        )
        }
        <hr />
        <div className="flex flex-row items-center justify-between text-xs mt-6">
          <span className="font-bold">Add New Contact</span>
        </div>
        <div className="flex flex-col space-y-1 mt-4 -mx-2">
          <form onSubmit={onAddContact}>
            <input
              type="text"
              // className="w-full mb-16 p-8"
              placeholder="Enter a public HEX key"
              value={newContact}
              onChange={(e) => setNewContact(e.target.value)}
            />
            <button type="submit" className="w-full mb-16 p-8">Add Contact</button>
          </form>
        </div>
      </div >
    </div >
  );
}

export interface Contact {
  pubkey: string;
}