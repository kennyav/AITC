import * as d3 from "d3";
import { useContext, useEffect, useRef, useState } from 'react';
import jsonGraph from "../../data/newData.json";
import AccountButton from "../../components/AccountButton";
import UserSideMenu from "@/components/UserSideMenu";
import { NostrConnectionContext } from "@/context/use-nostr-connection";

interface Props {
   graphData: string;
}

export default function Chart({ graphData }: Props) {
   const [nostrPubKey, setNostrPubKey] = useState<string>();
   const height = 800;
   const width = 1400;
   //const data = JSON.parse(graphData).nodes;
   let data: any = [];
   if (graphData) {
      try {
         data = JSON.parse(graphData).nodes;
      } catch (error) {
         console.error('Error parsing graphData:', error);
      }
   }
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
         
         points
            .on("mouseover", (event, d) => {

               console.log(d.attributes.label);
               d3.select("#dashboard-tooltip")
                  .style("opacity", 1)
                  .style("display", "block")
                  .html(
                     `<div class="dashboard-tooltip-label"></div><b>${d.attributes.label}</b>`
                  ); 
            })
            .on("mousemove", (event) => {
               d3.select("#dashboard-tooltip")
               .style("left", event.pageX + "px")
               .style("top", event.pageY + "px");
            })
            .on("mouseleave", () => {
               d3.select("#dashboard-tooltip")
               .style("opacity", 0)
               .style("display", "none");
            })

         
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
         <button className='absolute bg-blue-500 hover:bg-blue-700 active:bg-grey-700 focus:outline-none focus:ring focus:ring-grey-300 rounded w-32 truncate bottom-16 right-4' onClick={() => random()}>Random</button>
         <button className='absolute bg-blue-500 hover:bg-blue-700 active:bg-grey-700 focus:outline-none focus:ring focus:ring-grey-300 rounded w-32 truncate bottom-24 right-4' onClick={() => reset()}>Reset</button>
         <svg width={"100%"} height={"100vh"}>
            <g></g>
         </svg>
         <div id="dashboard-tooltip">
            <div id="dashboard-tooltip-text">
            </div>
         </div>
         <UserSideMenu open={false} />
      </div>
   )

}



