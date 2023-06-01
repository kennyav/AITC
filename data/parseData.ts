interface Props {
   metadata: Record<string, Metadata>;
}

export interface Metadata {
   name?: string;
   about?: string;
   picture?: string;
   nip05?: string;
}

// Function to generate random numbers within a circle
function generateRandomPointInCircle(centerX: number, centerY: number, radius: number) {
   // Generate random points within a square that encloses the circle
   let x, y;
   do {
      // Generate random x and y coordinates within the square
      x = Math.random() * (radius * 2) - radius;
      y = Math.random() * (radius * 2) - radius;
   } while (x * x + y * y > radius * radius); // Check if the point lies outside the circle

   // Calculate the final coordinates within the circle
   const finalX = centerX + x;
   const finalY = centerY + y;

   return { x: finalX, y: finalY };
}

function createRandomClusters(numClusters: number, xMin: number, xMax: number, yMin: number, yMax: number): [number, number][][] {
   const clusters: [number, number][][] = [];
   for (let i = 0; i < numClusters; i++) {
     const numPoints = Math.floor(Math.random() * 10) + 1; // Generate a random number of points
     const points: [number, number][] = [];
     for (let j = 0; j < numPoints; j++) {
       const x = Math.random() * (xMax - xMin) + xMin; // Generate a random x-coordinate
       const y = Math.random() * (yMax - yMin) + yMin; // Generate a random y-coordinate
       points.push([x, y]);
     }
     clusters.push(points);
   }
   console.log(clusters);

   return clusters;
 }
 


export function updateData(data: Props) {
   const centerX = 0; // X-coordinate of the center of the circle
   const centerY = 0; // Y-coordinate of the center of the circle
   const radius = 1000; // Radius of the circle


   // it is an list of objects with the key being the pubkey and the data as the value
   // we need to convert this into json data that matches our schema
   const newData = Object.entries(data.metadata).map(([pubkey, metadata]) => {
      return {
         "key": pubkey,
         "attributes": {
            "label": metadata.name || null,
            // "tag": null,
            // "cluster": null,
            "x": 0,
            "y": 0,
            // "score": 0,
            // "color": null,
            // "clusterLabel": null,
            "image": metadata.picture || null,
            "size": 1,
            "nip05": metadata.nip05 || null,
            "description": metadata.about || null,
         },
      };
   });
   const dataString = JSON.stringify({
      "attributes": {},
      "nodes": newData,
   });

   return dataString;

}