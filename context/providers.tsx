import RelayProvider from "./relay-provider";
import KeysProvider from '../context/keys-provider';
import UserProvider from "./user-provider";
import FollowingProvider from "./following-provider";
import RelayPoolProvider from "./use-relays-pool";

export default function Providers({ children }: { children: React.ReactNode }) {

   return (
      <RelayProvider>
         <RelayPoolProvider>
            <KeysProvider>
               <UserProvider>
                  <FollowingProvider>
                     {children}
                  </FollowingProvider>
               </UserProvider>
            </KeysProvider>
         </RelayPoolProvider>
      </RelayProvider>
   )
}