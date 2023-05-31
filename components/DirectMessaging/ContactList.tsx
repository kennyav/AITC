import { nip19 } from "nostr-tools";
import React, { useEffect, useMemo, useState } from "react";
import { getProfileDataFromMetaData } from "../../context/helperFunctions";
import { useMetadata } from "../../context/use-metadata";
import styles from '../../styles/Home.module.css'
import CopyToClipboard from "react-copy-to-clipboard";


interface Props {
  pubkey: string;
  currentOpenContact: string;
  onOpenContact: (pubkey: string) => void;
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
      <div className="flex flex-col bg-[#0f172a] items-center border border-gray-200 mt-4 w-full py-6 px-4 rounded-lg">
        <CopyToClipboard
          text={pubkey}
          onCopy={() => alert(`Copied your public key!`)}
        >
          <div className="flex flex-row w-full gap-2">
            <button className="bg-white p-1 h-auto rounded-full">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" className="w-5 h-5">
                <path stroke-linecap="round" stroke-linejoin="round" d="M15.666 3.888A2.25 2.25 0 0013.5 2.25h-3c-1.03 0-1.9.693-2.166 1.638m7.332 0c.055.194.084.4.084.612v0a.75.75 0 01-.75.75H9a.75.75 0 01-.75-.75v0c0-.212.03-.418.084-.612m7.332 0c.646.049 1.288.11 1.927.184 1.1.128 1.907 1.077 1.907 2.185V19.5a2.25 2.25 0 01-2.25 2.25H6.75A2.25 2.25 0 014.5 19.5V6.257c0-1.108.806-2.057 1.907-2.185a48.208 48.208 0 011.927-.184" />
              </svg>
            </button>
            <h1 className="text-white text-sm font-semibold">
              Copy your public key to the left and share with friends to chat with them
            </h1>
          </div>
        </CopyToClipboard>
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
              {contacts.map((contact) => {
                const profileData = getProfileDataFromMetaData(
                  metadata,
                  contact.pubkey
                );
                return (
                  <li key={profileData.pubkey}>
                    <div className="flex flex-row items-center justify-between text-xs">
                      <button className="flex flex-row items-center hover:bg-gray-300 p-2 rounded-lg w-3/4" onClick={() => onOpenContact(contact.pubkey)}>
                        <img className="h-10 w-10 rounded-full border" src={profileData.image} alt="" />
                        <div className="ml-2 text-sm font-semibold truncate">{profileData.name}</div>
                      </button>
                      <CopyToClipboard
                        text={profileData.pubkey}
                        onCopy={() => alert(`Copied ${profileData.name}'s public key!`)}
                      >
                        <button className="hover:bg-gray-300 rounded-full p-1">
                          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" className="w-5 h-5">
                            <path stroke-linecap="round" stroke-linejoin="round" d="M15.666 3.888A2.25 2.25 0 0013.5 2.25h-3c-1.03 0-1.9.693-2.166 1.638m7.332 0c.055.194.084.4.084.612v0a.75.75 0 01-.75.75H9a.75.75 0 01-.75-.75v0c0-.212.03-.418.084-.612m7.332 0c.646.049 1.288.11 1.927.184 1.1.128 1.907 1.077 1.907 2.185V19.5a2.25 2.25 0 01-2.25 2.25H6.75A2.25 2.25 0 014.5 19.5V6.257c0-1.108.806-2.057 1.907-2.185a48.208 48.208 0 011.927-.184" />
                          </svg>
                        </button>
                      </CopyToClipboard>
                    </div>
                  </li>
                )
              })}
            </ul>
          </div>
        )
        }
        <hr />
        <div className="flex flex-col bg-[#0f172a] items-center border border-gray-200 mt-4 w-full py-6 px-4 rounded-lg">
          <h1 className="text-white text-sm font-semibold">
            Add your friends public keys to receive their messages and to message with them
          </h1>
        </div>
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