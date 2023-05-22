import React, { useEffect, useState } from 'react'
// nostr imports
import { Event } from "nostr-tools";
import { Metadata } from "@/utils/parseData";
import { useRelayPool } from "@/context/use-relays-pool";
import { Relays } from "@/context/relays";
import { updateData } from "@/data/parseData";
import Chart from '@/pages/section/main-page';

export default function MainLoadingPage() {
   const { relayPool } = useRelayPool();
   const [metadata, setMetaData] = useState<Record<string, Metadata>>({});
   const [graphData, setGraphData] = useState("");
   const [doneLoading, setDoneLoading] = useState(false);

   useEffect(() => {
      // get the meta data from a user
      if (!relayPool) return;

      // get metadata from a user
      const sub = relayPool.sub(Relays.getRelays(), [{
         kinds: [0],
         limit: 500,
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
         setDoneLoading(true);
         sub.unsub();
      })
   }, [relayPool]);

   useEffect(() => {
      setGraphData(updateData({ metadata }));
   }, [metadata])

   return (
      <div>
         {doneLoading ? (
            <Chart graphData={graphData} />
         ) : (
            <div className="flex justify-center items-center h-screen">
               <div className="flex items-center justify-center ">
                  <div className="w-40 h-40 border-t-4 border-b-4 border-l-4 rounded-full animate-spin"></div>
               </div>
            </div>
         )}
      </div>
   )
}
