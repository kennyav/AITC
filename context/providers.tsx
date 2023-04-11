import RelayProvider from "./relay-provider";
import KeysProvider from '../context/keys-provider';
import UserProvider from "./user-provider";
import FollowingProvider from "./following-provider";

export default function Providers({ children }: { children: React.ReactNode }) {

   return (
      <RelayProvider>
         <KeysProvider>
            <UserProvider>
               <FollowingProvider>
                  {children}
               </FollowingProvider>
            </UserProvider>
         </KeysProvider>
      </RelayProvider>
   )
}