import RelayPoolProvider from "./use-relays-pool";
import NostrConnectionProvider from "./use-nostr-connection";


export default function Providers({ children }: { children: React.ReactNode }) {

   return (
      <RelayPoolProvider>
         <NostrConnectionProvider>
            {children}
         </NostrConnectionProvider>
      </RelayPoolProvider>
   )
}