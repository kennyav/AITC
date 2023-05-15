import { Metadata } from "@/utils/parseData";

interface Props {
   metadata: Record<string, Metadata>;
}

function generateRandomHexColor(): string {
   const hexChars = '0123456789ABCDEF';
   let color = '#';
   for (let i = 0; i < 6; i++) {
      color += hexChars[Math.floor(Math.random() * hexChars.length)];
   }
   return color;
}


export function updateData(data: Props) {
   const min = -1000;
   const max = 1000;

   // it is an list of objects with the key being the pubkey and the data as the value
   // we need to convert this into json data that matches our schema
   const newData = Object.entries(data.metadata).map(([pubkey, metadata]) => {
      return {
         "key": pubkey,
         "attributes": {
            "label": metadata.name,
            "tag": null,
            "cluster": null,
            "x": Math.floor(Math.random() * (max - min + 1)) + min,
            "y": Math.floor(Math.random() * (max - min + 1)) + min,
            "score": 0,
            "color": generateRandomHexColor(),
            "clusterLabel": null,
            "image": metadata.picture,
            "size": 1,
            "nip05": metadata.nip05,
            "description": metadata.about,
         },
      };
   });

   const dataString = JSON.stringify({
      "attributes": {},
      "nodes": newData,
   });

   console.log(dataString)
   return dataString;

}
/*
libertarian. Chaotic good. Bitcoin. Monero. Encrypt everything."
banner: "https://nostr.build/i/nostr.build_107aeafd9eca3452b4e1dc351e7392cd4e4b266c042d63a32a340d4aa1695ac5.jpg"
lud16: "lprimordium@getalby.com"
name: "Libertas Primordium"
nip05: "lprimordium@iris.to"
nip05valid: true
picture: "https://nostr.build/i/nostr.build_f8806459055dc6a7e72c881ceac9a2a7dda7ea703afdf12c570be57a06498309.jpg"
website: "https://github.com/libertas-primordium"
*/