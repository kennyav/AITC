import { nip19 } from "nostr-tools";
import React, { useEffect, useMemo, useState } from "react";
import { getProfileDataFromMetaData } from "../../context/helperFunctions";
import { useMetadata } from "../../context/use-metadata";
import styles from '../../styles/Home.module.css'
import CopyToClipboard from "react-copy-to-clipboard";
import { set } from "superstruct";

interface Props {
  pubkey: string;
  currentOpenContact: string;
  onOpenContact?: (pubkey: string) => void;
}

export default function ContactsList({ pubkey, currentOpenContact, onOpenContact }: Props) {

  const [contacts, setContacts] = useState<Contact[] | null>(null);
  const [newContact, setNewContact] = useState("");
  const [name, setName] = useState<string>("Loading ...");
  const [image, setImage] = useState<string>("Loading ...");

  // on start up load contacts from local storage for this user
  useEffect(() => {
    // returns a string of contacts
    const storedContacts = localStorage.getItem(`contacts:${pubkey}`);
    console.log(storedContacts)
    if (storedContacts !== null) {
      setContacts(JSON.parse(storedContacts));
    }
  }, [pubkey]);

  // whenever we add a new contact, save it to local storage
  useEffect(() => {
    if (contacts !== null) {
      localStorage.setItem(`contacts:${pubkey}`, JSON.stringify(contacts));
    }
  }, [contacts]);

  const pubkeysToFetch = useMemo(
    () => contacts?.map((contact) => contact.pubkey),
    [contacts]
  );

  const { metadata } = useMetadata({ pubkeys: pubkeysToFetch });

  useEffect(() => {
    setName(getProfileDataFromMetaData(metadata, pubkey).name)
    setImage(getProfileDataFromMetaData(metadata, pubkey).image)
  }, [pubkey, metadata]);


  function onAddContact(e: React.FormEvent) {
    e.preventDefault();
    if (!newContact) return;

    let hexPubkey = newContact;
    if (newContact.startsWith("npub"))
      hexPubkey = nip19.decode(newContact).data as string;

    // check if contacts is null, if so create a new array with the new contact
    if (!contacts) {
      setContacts([{ pubkey: hexPubkey }])
    } else {
      // check if contact already exists
      if (contacts.find((contact) => contact.pubkey === hexPubkey))
        return contacts;
      setContacts([...contacts, { pubkey: hexPubkey }]);
    }

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
          {contacts === null || contacts.length === 0 ? (
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
        {contacts !== null && contacts.length > 0 && (
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
              className="shadow-sm border border-gray-300 rounded-lg p-1"
              placeholder="Enter a public HEX key"
              value={newContact}
              onChange={(e) => setNewContact(e.target.value)}
            />
            <button type="submit" className="hover:bg-gray-400 rounded-lg p-1">Add Contact</button>
          </form>
        </div>
      </div >
    </div >
  );
}

export interface Contact {
  pubkey: string;
}