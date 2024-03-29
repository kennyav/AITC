import { Event, nip19 } from "nostr-tools";
import { Metadata, NostrProfile } from "../types/nostr";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { NostrAccountConnection } from "./use-nostr-connection";

export function insertEventIntoDescendingList<T extends Event>(
  sortedArray: T[],
  event: T
) {
  let start = 0;
  let end = sortedArray.length - 1;
  let midPoint;
  let position = start;

  if (end < 0) {
    position = 0;
  } else if (event.created_at < sortedArray[end].created_at) {
    position = end + 1;
  } else if (event.created_at >= sortedArray[start].created_at) {
    position = start;
  } else
    while (true) {
      if (end <= start + 1) {
        position = end;
        break;
      }
      midPoint = Math.floor(start + (end - start) / 2);
      if (sortedArray[midPoint].created_at > event.created_at) {
        start = midPoint;
      } else if (sortedArray[midPoint].created_at < event.created_at) {
        end = midPoint;
      } else {
        // aMidPoint === num
        position = midPoint;
        break;
      }
    }

  // insert when num is NOT already in (no duplicates)
  if (sortedArray[position]?.id !== event.id) {
    return [
      ...sortedArray.slice(0, position),
      event,
      ...sortedArray.slice(position),
    ];
  }

  return sortedArray;
}

export function getProfileDataFromMetaData(
  metadata: Record<string, Metadata>,
  pubkey: string
): NostrProfile {
  let meta = metadata[pubkey];
  if (!meta)
    return {
      pubkey,
      name: nip19.npubEncode(pubkey || ""),
      about: null,
      image: `https://avatars.dicebear.com/api/identicon/${pubkey}.svg`,
      lightning_address: null,
      nip05: null,
      link: "nostr:" + nip19.npubEncode(pubkey || ""),
    };

  const name = getName(metadata, pubkey);
  const image =
    meta.picture && meta.picture.length ? (meta.picture as string) : null;
  const about = meta.about && meta.about.length ? (meta.about as string) : null;
  const nip05 = meta.nip05 && meta.nip05.length ? (meta.nip05 as string) : null;
  const lud06 = meta.lud06 && meta.lud06.length ? (meta.lud06 as string) : null;

  return {
    name,
    image,
    about,
    pubkey,
    lightning_address: lud06,
    nip05,
    link: "nostr:" + nip19.npubEncode(pubkey),
  } as NostrProfile;
}

export function getName(metadata: Record<string, any>, pubkey: string): string {
  let meta = metadata[pubkey];
  if (meta) {
    if (meta.nip05 && meta.nip05verified) {
      if (meta.nip05.startsWith("_@")) return meta.nip05.slice(2);
      return meta.nip05;
    }
    if (meta.name && meta.name.length) return meta.name;
  } else if (pubkey) {
    let npub = nip19.npubEncode(pubkey);
    return npub;
  }

  return "_";
}


// export function usePersistState<T>(key: string, initialValue: T | (() => T)): [T, Dispatch<SetStateAction<T>>] {
//   const [state, setState] = useState<T>(
//     typeof initialValue === 'function' ? (initialValue as () => T)() : initialValue
//   );

//   useEffect(() => {
//     const storedValue = localStorage.getItem(key);
//     console.log("Stored value", storedValue)
//     if (storedValue) {
//       try {
//         const parsedValue = JSON.parse(storedValue);
//         console.log("Parsed value", parsedValue)
//         setState(parsedValue);
//       } catch (error) {
//         console.error('Error parsing stored value:', error);
//       }
//     }
//   }, [key]);

//   console.log("State", state)
//   useEffect(() => {
//     localStorage.setItem(key, JSON.stringify(state));
//     console.log("State", state)
//   }, [key, state]);

//   return [state, setState];
// }


export function usePersistState<T>(key: string, initialValue: T | (() => T)): [T, Dispatch<SetStateAction<T>>] {
  const [storedValue, setStoredValue] = useState<string | null>(null);

  useEffect(() => {
    setStoredValue(localStorage.getItem(key));
  }, [key]);

  const [state, setState] = useState<T>(() => {
    if (storedValue) {
      try {
        return JSON.parse(storedValue);
      } catch (error) {
        console.error('Error parsing stored value:', error);
      }
    }
    return typeof initialValue === 'function' ? (initialValue as () => T)() : initialValue;
  });

  useEffect(() => {
    localStorage.setItem(key, JSON.stringify(state));
  }, [key, state]);

  return [state, setState];
}



