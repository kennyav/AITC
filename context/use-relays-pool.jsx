import { SimplePool } from "nostr-tools";
import {
  createContext,
  PropsWithChildren,
  useContext,
  useEffect,
  useState,
} from "react";
import { Relays } from "./relays";

//const RelayPoolContext = createContext<State | null>(null);
const RelayPoolContext = createContext(null)

export default function RelayPoolProvider({children}){
  const [relayPool, setRelayPool] = useState(null);


  useEffect(() => {
    const _pool = new SimplePool();
    setRelayPool(_pool);

    return () => {
      _pool.close(Relays.getRelays());
    };
  }, []);

  return (
    <RelayPoolContext.Provider
      value={{
        relayPool,
      }}
    >
      {children}
    </RelayPoolContext.Provider>
  );
};

export const useRelayPool = () => {
  const result = useContext(RelayPoolContext);
  console.log("useRelayPool", result)

  if (!result) throw new Error("No Relay Pool Provider was found");

  return result;
};