import { Event, SimplePool } from "nostr-tools";
import { useEffect, useRef, useState } from "react";
import { Relays } from "../context/relays";

export interface Metadata {
   name?: string;
   about?: string;
   picture?: string;
   nip05?: string;
}

interface Props {
   relayPool: SimplePool | null;
   events: Event[];
}

export function parseEvents({ relayPool, events }: Props) {

   const [metadata, setMetaData] = useState<Record<string, Metadata>>({});
   const metadataFetched = useRef<Record<string, boolean>>({});

   useEffect(() => {
      // get the meta data from a user
      if (!relayPool) return;

      // we want to exclude the keys that we already have in the subscription
      const pubkeysToFetch = events
         .filter((event) => !metadataFetched.current[event.pubkey])
         .map((event) => event.pubkey);

      // mark the pubkeys as fetched
      pubkeysToFetch.forEach((pubkey) => {
         metadataFetched.current[pubkey] = true;
      })

      // get metadata from a user
      const sub = relayPool.sub(Relays.getRelays(), [{
         kinds: [0],
         authors: pubkeysToFetch,
      }])

      // on subscribtion get event and log it
      sub.on('event', (event: Event) => {

         // meta data is stored as json so we have to parse it
         const metadata = JSON.parse(event.content) as Metadata;

         setMetaData((cur) => ({
            ...cur,
            [event.pubkey]: metadata
         }))
      });

      // end of stored event then unsubscribe
      sub.on('eose', () => {
         sub.unsub();
      })
   }, [relayPool, events]);

   return metadata;
}