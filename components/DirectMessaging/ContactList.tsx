import { nip19 } from "nostr-tools";
import React, { useMemo } from "react";
import { useStatePersist } from "use-state-persist";
import { getProfileDataFromMetaData } from "../../context/helperFunctions";
import { useMetadata } from "../../context/use-metadata";
import styles from '../../styles/Home.module.css'
import CopyToClipboard from "react-copy-to-clipboard";

interface Props {
  pubkey: string;
  currentOpenContact: string;
  onOpenContact?: (pubkey: string) => void;
}

export default function ContactsList({
  pubkey,
  currentOpenContact,
  onOpenContact,
}: Props) {
  const [contacts, setContacts] = useStatePersist<Contact[]>(
    `contacts:${pubkey}`,
    []
  );

  const pubkeysToFetch = useMemo(
    () => contacts.map((contact) => contact.pubkey),
    [contacts]
  );

  const { metadata } = useMetadata({ pubkeys: pubkeysToFetch });

  const [newContact, setNewContact] = React.useState("");

  function onAddContact(e: React.FormEvent) {
    e.preventDefault();
    if (!newContact) return;

    let hexPubkey = newContact;

    if (newContact.startsWith("npub"))
      hexPubkey = nip19.decode(newContact).data as string;

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
    // <div className="flex flex-col gap-24">
    //   {contacts.length === 0 && (
    //     <p className="text-body3 text-center">No contacts yet</p>
    //   )}
    //   {contacts.length > 0 && (
    //     <ul>
    //       {contacts.map((contact, i) => {
    //         const profileData = getProfileDataFromMetaData(
    //           metadata,
    //           contact.pubkey
    //         );
    //         return (
    //           <li key={i} className="overflow-hidden">
    //             <button
    //               className={`text-ellipsis overflow-hidden w-full p-4 flex gap-4 text-left rounded-lg ${currentOpenContact === contact.pubkey
    //                   ? "bg-violet-400 bg-opacity-50"
    //                   : "hover:bg-gray-100 hover:bg-opacity-10 active:bg-opacity-20 active:scale-95"
    //                 }`}
    //               onClick={() => onOpenContact?.(contact.pubkey)}
    //             >
    //               <img
    //                 src={profileData.image}
    //                 className="shrink-0 bg-gray-200 w-42 aspect-square rounded-full border border-gray-400"
    //                 alt=""
    //               />
    //               <div className="overflow-hidden">
    //                 <p className="text-body3 font-bold overflow-hidden text-ellipsis">
    //                   {profileData.name}
    //                 </p>
    //                 <p className="text-body5 text-gray-400 overflow-hidden text-ellipsis">
    //                   {profileData.pubkey}
    //                 </p>
    //               </div>
    //             </button>
    //           </li>
    //         );
    //       })}
    //     </ul>
    //   )}
    //   <hr />
    //   <form onSubmit={onAddContact}>
    //     <input
    //       type="text"
    //       className="w-full mb-16 p-8"
    //       placeholder="Enter a public HEX key"
    //       value={newContact}
    //       onChange={(e) => setNewContact(e.target.value)}
    //     />
    //     <button className="bg-violet-500 text-body3 px-16 py-4 rounded-8 font-bold hover:bg-violet-600 active:scale-90 w-full">
    //       Add New Contact
    //     </button>
    //   </form>
    // </div>
    <div className="flex flex-col py-8 pl-4 pr-3 w-full h-screen bg-white flex-shrink-0 rounded-lg">
      <div className="flex flex-row items-center h-12 w-full text-left">
        <div className={`${styles.testFont} text-xl`}>AITC CHAT</div>
      </div>
      <div className="flex flex-col items-center bg-[#0f172a] border border-gray-200 mt-4 w-full py-6 px-4 rounded-lg">
        <div className="h-20 w-20 rounded-full border overflow-hidden">
          <img
            src={getProfileDataFromMetaData(metadata, pubkey).image}
            alt="Avatar"
            className="h-full w-full"
          />
        </div>
        <div className="w-3/4 overflow-hidden text-sm text-white font-semibold mt-2 text-left">
          <CopyToClipboard
            text={getProfileDataFromMetaData(metadata, pubkey).name}
            onCopy={() => alert("Copied public key!")}
          >
            <button className="overflow-hidden w-full">
              <p className="truncate">{getProfileDataFromMetaData(metadata, pubkey).name}</p>
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
          <ul>
            {contacts.map((contact, i) => {
              const profileData = getProfileDataFromMetaData(
                metadata,
                contact.pubkey
              );
              return (
                <li key={i}>
                  <div className="flex flex-col space-y-1 mt-4 -mx-2 h-48 overflow-y-scroll">
                    <button className="flex flex-row items-center hover:bg-gray-100 rounded-xl p-2" onClick={() => onOpenContact?.(contact.pubkey)}>
                      {/* <div className="flex items-center justify-center h-8 w-8 bg-indigo-200 rounded-full"> */}
                      <img className="h-10 w-10 rounded-full border" src={profileData.image} alt="" />

                      {/* </div> */}
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