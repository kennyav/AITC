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
            "x": generateRandomPointInCircle(centerX, centerY, radius).x,
            "y": generateRandomPointInCircle(centerX, centerY, radius).y,
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