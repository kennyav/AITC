// import * as d3 from "d3";
// import { useContext, useEffect, useRef } from 'react';
// import jsonGraph from "../data/data.json";
// import AccountButton from "./AccountButton";
// import { KeysContext } from "@/context/keys-provider";


// export default function Chart() {

//    const height = 800;
//    const width = 1400;
//    const data = jsonGraph.nodes;
//    // @ts-ignore
//    const { keys } = useContext(KeysContext);


//    let zoom: any = d3.zoom()
//             .on('zoom', handleZoom);

//    function handleZoom(e: any) {
//       d3.select('svg g')
//          .attr('transform', e.transform);
//    }

//    d3.select('svg')
//       .call(zoom);


//    // color algorithm
//    const colorValue = (value: number) => {
//       return Math.abs((value - 0) / 10);
//    }


//    d3.select('svg g')
//       .selectAll('circle')
//       .data(data)
//       .join('circle')
//       .attr('cx', function (d, i: number) { return data[i].attributes.x; })
//       .attr('cy', function (d, i: number) { return data[i].attributes.y; })
//       .attr('r', 4)
//       .attr("fill", (d: any, i: number) => d3.interpolateRainbow(colorValue(data[i].attributes.x - data[i].attributes.y)))
//    // .on('click', function (i: number) { setI(i), clicked(event)})


//    // function clicked(event: any) {
//    //    event.stopPropagation();
//    //    d3.select('svg').transition().duration(750).call(
//    //       zoom.transform,
//    //       d3.zoomIdentity.translate(width / 2, height / 2).scale(40).translate(-data[i].attributes.x, -data[i].attributes.y)
//    //    );
//    // }

//    function random() {
//       const randomIndex = Math.floor(Math.random() * data.length);
//       d3.select('svg').transition().duration(2500).call(
//          zoom.transform,
//          d3.zoomIdentity.translate(width / 2, height / 2).scale(40).translate(-data[randomIndex].attributes.x, -data[randomIndex].attributes.y)
//       );
//    }

//    function reset() {
//       d3.select('svg').transition().duration(750).call(
//          zoom.transform,
//          d3.zoomIdentity
//       );
//    }

//    return (
//       <div>
//          <AccountButton pubkey={keys?.publicKey} />
//          <button className='absolute bg-blue-500 hover:bg-blue-700 active:bg-grey-700 focus:outline-none focus:ring focus:ring-grey-300 rounded w-32 truncate top-16 right-4' onClick={() => random()}>Random</button>
//          <button className='absolute bg-blue-500 hover:bg-blue-700 active:bg-grey-700 focus:outline-none focus:ring focus:ring-grey-300 rounded w-32 truncate top-24 right-4' onClick={() => reset()}>Reset</button>
//          <svg width={"100%"} height={"100vh"}>
//             <g></g>
//          </svg>
//       </div>
//    )

// }

import * as d3 from "d3";
import { useContext, useEffect, useRef } from 'react';
import jsonGraph from "../data/data.json";
import AccountButton from "./AccountButton";
import { KeysContext } from "@/context/keys-provider";


export default function Chart() {

   const height = 800;
   const width = 1400;
   const data = jsonGraph.nodes;
   // @ts-ignore
   const { keys } = useContext(KeysContext);


   let zoom: any = d3.zoom()
            .on('zoom', handleZoom);

   function handleZoom(e: any) {
      d3.select('svg g')
         .attr('transform', e.transform);
   }

   useEffect(() => {
      const svg = d3.select('svg');
      if (!svg.empty()) {
         svg.call(zoom);

         // color algorithm
         const colorValue = (value: number) => {
            return Math.abs((value - 0) / 10);
         }

         svg.select('g')
            .selectAll('circle')
            .data(data)
            .join('circle')
            .attr('cx', function (d, i: number) { return data[i].attributes.x; })
            .attr('cy', function (d, i: number) { return data[i].attributes.y; })
            .attr('r', 4)
            .attr("fill", (d: any, i: number) => d3.interpolateRainbow(colorValue(data[i].attributes.x - data[i].attributes.y)))
         // .on('click', function (i: number) { setI(i), clicked(event)})


         // function clicked(event: any) {
         //    event.stopPropagation();
         //    d3.select('svg').transition().duration(750).call(
         //       zoom.transform,
         //       d3.zoomIdentity.translate(width / 2, height / 2).scale(40).translate(-data[i].attributes.x, -data[i].attributes.y)
         //    );
         // }
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
         <AccountButton pubkey={keys.publicKey} />
         <button className='absolute bg-blue-500 hover:bg-blue-700 active:bg-grey-700 focus:outline-none focus:ring focus:ring-grey-300 rounded w-32 truncate top-16 right-4' onClick={() => random()}>Random</button>
         <button className='absolute bg-blue-500 hover:bg-blue-700 active:bg-grey-700 focus:outline-none focus:ring focus:ring-grey-300 rounded w-32 truncate top-24 right-4' onClick={() => reset()}>Reset</button>
         <svg width={"100%"} height={"100vh"}>
            <g></g>
         </svg>
      </div>
   )

}



