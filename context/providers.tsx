import RelayProvider from "./relay-provider";
import KeysProvider from '../context/keys-provider';

export default function Providers({ children }: { children: React.ReactNode }) {

   return (
      <RelayProvider>
         <KeysProvider>
            {children}
         </KeysProvider>
      </RelayProvider>
   )
}