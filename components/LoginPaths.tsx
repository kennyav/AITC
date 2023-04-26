import React from 'react'
import Button from './Button'
import { utils as secpUtils } from "@noble/secp256k1";
import { generatePrivateKey, getPublicKey, nip19 } from "nostr-tools";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useDispatch } from 'react-redux';
import { toggleConnectState } from '@/globalRedux/features/connectSlice';
import {
   NostrAccountConnection,
   useNostrConnection,
} from "../context/use-nostr-connection";

export default function LoginPaths() {
   const { connection, setConnection } = useNostrConnection();
   const router = useRouter();
   const dispatch = useDispatch();

   if (connection !== null) {
      dispatch(toggleConnectState(true));
      router.push("/");
    }

   const [generateKey, setGenerateKey] = useState(false);
   const [inputtedKey, setInputtedKey] = useState(false);
   const [privKey, setPrivKey] = useState("");

   const clickConnect = async (
      type: "generated-keys" | "inputted-keys" | "nostr-ext"
   ) => {
      let connectionObject: NostrAccountConnection;
      try {
         // checks if the user is using nostr extension
         if (type === "nostr-ext")
            connectionObject = await connectNostrExt();
         else if (type === "generated-keys")
            connectionObject = connectGeneratedKeys();
         else if (type === "inputted-keys")
            connectionObject = connectInputtedKey();
         else throw new Error("Invalid tab");

         // setting the connection based on what type of login we use
         setConnection(connectionObject);
      } catch (error) {
         console.log(error);
         alert("Something wrong happened");
      }
  }

   function isValidPrivateKey(
      prvKey: string | null | undefined
   ): prvKey is string {
      if (!prvKey) return false;
      const isValidHexKey = secpUtils.isValidPrivateKey(prvKey);
      const isValidBech32Key =
         prvKey.startsWith("nsec") &&
         secpUtils.isValidPrivateKey(nip19.decode(prvKey).data as string);

      return isValidHexKey || isValidBech32Key;
   }

   // handle if the user presses nostr extension
   const connectNostrExt = async () => {
      if (!window.nostr)
         throw new Error("Nostr extension not found");

      const pubkey = await window.nostr.getPublicKey();

      return {
         type: "nostr-ext",
         pubkey: pubkey,
      } as NostrAccountConnection;
   }

   // handle if the user presses generate key
   const connectGeneratedKeys = () => {
      if (!privKey) throw new Error("Failed to generate private key");

      const pubKey = getPublicKey(privKey);
      return {
         type: "generated-keys",
         prvkey: privKey,
         pubkey: pubKey,
      } as NostrAccountConnection;
   }

   // handle if the user presses input private key
   const connectInputtedKey = () => {
      // checks if the private key is valid
      if (!isValidPrivateKey(privKey))
         throw new Error("Invalid private key");
      // checks if the private key is hex or bech32 and decodes it if it is bech32
      const privKeyHex = privKey.startsWith("nsec")
         ? nip19.decode(privKey).data as string
         : privKey;
      // gets the public key from the private key
      const pubKey = getPublicKey(privKeyHex);
      // returns the object for our connection api
      return {
         type: "inputted-keys",
         pubkey: pubKey,
         prvkey: privKeyHex,
      } as NostrAccountConnection;
   }


   return (
      <div className="flex items-center justify-center">
         {!generateKey && !inputtedKey ?
            <div>
               <Button variant="outline" type="button" size="sm" className="justify-center text-white" onClick={() => {
                  setPrivKey(generatePrivateKey())
                  setGenerateKey(true)
                  setInputtedKey(false)
               }}>
                  Generate Key
               </Button>
               <Button variant="outline" type="button" size="sm" className="justify-center text-white" onClick={() => {
                  setGenerateKey(false)
                  setInputtedKey(true)
               }}>
                  Input Private Key
               </Button>
               <Button variant="outline" type="button" size="sm" className="justify-center text-white" onClick={() => {
                  setGenerateKey(false)
                  setInputtedKey(false)
                  clickConnect("nostr-ext")
               }}>
                  Login through Nostr Extension
               </Button>
            </div>
            : (
               generateKey && !inputtedKey ?
                  <form onSubmit={() => clickConnect("generated-keys")}>
                     <input type="text" placeholder="input private key ..." value={privKey} name="inputField" id="inputField" style={{ textOverflow: "ellipsis" }} onChange={(e) => setPrivKey(e.target.value)} />
                     <Button type="submit"> Connect </Button>
                  </form>
                  :
                  <form onSubmit={() => clickConnect("inputted-keys")}>
                     <input type="text" placeholder="input private key ..." value={privKey} name="inputField" id="inputField" style={{ textOverflow: "ellipsis" }} onChange={(e) => setPrivKey(e.target.value)} />
                     <Button type="submit"> Connect </Button>
                  </form>
            )}
      </div>
   )
}
