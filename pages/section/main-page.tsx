import * as d3 from "d3";
import { useContext, useEffect, useRef, useState } from 'react';
import jsonGraph from "../../data/newData.json";
import AccountButton from "../../components/AccountButton";
import UserSideMenu from "@/components/UserSideMenu";
import { NostrConnectionContext } from "@/context/use-nostr-connection";

// nostr imports
import { Event } from "nostr-tools";
import { Metadata } from "@/utils/parseData";
import { useRelayPool } from "@/context/use-relays-pool";
import { Relays } from "@/context/relays";
import { updateData } from "@/data/parseData";


export default function Chart() {
   // const { relayPool } = useRelayPool();
   // const [events, setEvents] = useState<Event[]>([]);
   // const [metadata, setMetaData] = useState<Record<string, Metadata>>({});
   // const metadataFetched = useRef<Record<string, boolean>>({});
   // const [graphData, setGraphData] = useState("");


   // useEffect(() => {
   //    if (!relayPool) return;
   //    // Create Subscription
   //    const sub = relayPool.sub(Relays.getRelays(), [
   //       // to get all of the encrypted messages that we have sent to the current contact
   //       {
   //          kinds: [1],
   //          limit: 500,
   //       }
   //    ])

   //    // on subscribtion get event and log it
   //    sub.on('event', (event: Event) => {
   //       setEvents([...events, event]);
   //    });

   //    return () => {
   //       // close the subscription when we unmount the component
   //       sub.unsub();
   //    }
   // }, [relayPool]);

   // useEffect(() => {
   //    // get the meta data from a user
   //    if (!relayPool) return;

   //    // we want to exclude the keys that we already have in the subscription
   //    const pubkeysToFetch = events
   //       .filter((event) => !metadataFetched.current[event.pubkey])
   //       .map((event) => event.pubkey);

   //    // mark the pubkeys as fetched
   //    pubkeysToFetch.forEach((pubkey) => {
   //       metadataFetched.current[pubkey] = true;
   //    })

   //    // get metadata from a user
   //    const sub = relayPool.sub(Relays.getRelays(), [{
   //       kinds: [0],
   //       authors: pubkeysToFetch,
   //    }])

   //    // on subscribtion get event and log it
   //    sub.on('event', (event: Event) => {

   //       // meta data is stored as json so we have to parse it
   //       const metadata = JSON.parse(event.content) as Metadata;

   //       setMetaData((cur) => ({
   //          ...cur,
   //          [event.pubkey]: metadata
   //       }))
   //    });

   //    // end of stored event then unsubscribe
   //    sub.on('eose', () => {
   //       sub.unsub();
   //    })
   // }, [events, relayPool]);

   // useEffect(() => {
   //    setGraphData(updateData({ metadata }));
   // }, [metadata])

   const [nostrPubKey, setNostrPubKey] = useState<string>();
   const height = 800;
   const width = 1400;
   const data = jsonGraph.nodes;
   const result = useContext(NostrConnectionContext);

   let zoom: any = d3.zoom()
      .on('zoom', handleZoom);

   function handleZoom(e: any) {
      d3.select('svg g')
         .attr('transform', e.transform);
   }

   useEffect(() => {
      if (result?.connection?.pubkey !== null) {
         setNostrPubKey(result?.connection?.pubkey);
      } else {
         throw new Error("Nostr Connection not found");
      }

      const svg = d3.select('svg');
      if (!svg.empty()) {
         svg.call(zoom);

         // color algorithm
         const colorValue = (value: number) => {
            return Math.abs((value - 0) / 10);
         }
         
         const points = svg.select('g')
            .selectAll('circle')
            .data(data)
            .enter()
            .append("g");
         
         points.append("circle")
            .attr('cx', function (d, i: number) { return data[i].attributes.x; })
            .attr('cy', function (d, i: number) { return data[i].attributes.y; })
            .attr('r', 4)
            .attr("fill", (d: any, i: number) => d3.interpolateRainbow(colorValue(data[i].attributes.x - data[i].attributes.y)));

         points
            .on("click", function (event, d) {
               var index = data.findIndex(function(obj) {
                  return obj.key == d.key
               })
               event.stopPropagation();
               d3.select('svg').transition().duration(750).call(
                  zoom.transform,
                  d3.zoomIdentity.translate(width / 2, height / 2).scale(40).translate(-data[index].attributes.x, -data[index].attributes.y)
               )
            });

         
      }
   }, [data]);


   function random() {
      const randomIndex = Math.floor(Math.random() * data.length);
      d3.select('svg').transition().duration(2500).call(
         zoom.transform,
         d3.zoomIdentity.translate(width / 2, height / 2).scale(40).translate(-data[randomIndex].attributes.x, -data[randomIndex].attributes.y)
      );
   }

   function reset() {
      d3.select('svg').transition().duration(750).call(
         zoom.transform,
         d3.zoomIdentity
      );
   }

   return (
      <div>
         <AccountButton pubkey={nostrPubKey!} />
         <button className='absolute bg-blue-500 hover:bg-blue-700 active:bg-grey-700 focus:outline-none focus:ring focus:ring-grey-300 rounded w-32 truncate top-16 right-4' onClick={() => random()}>Random</button>
         <button className='absolute bg-blue-500 hover:bg-blue-700 active:bg-grey-700 focus:outline-none focus:ring focus:ring-grey-300 rounded w-32 truncate top-24 right-4' onClick={() => reset()}>Reset</button>
         <svg width={"100%"} height={"100vh"}>
            <g></g>
         </svg>
         <UserSideMenu open={false} />
      </div>
   )

}



