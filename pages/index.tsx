import { useContext, useEffect, useState } from "react";
import { RelayContext } from "../context/relay-provider";

// components
import Chart from "./section/main-page";
import UserSideMenu from "../components/UserSideMenu";
import { useNostrConnection } from "@/context/use-nostr-connection";
import Login from "./section/login";
import LandingPage from "./section/landing-page";
import { Lan } from "@mui/icons-material";


export default function Home() {

  const { connection: nostrConnection } = useNostrConnection();

  if (nostrConnection === null) {
    console.log("nostrConnection is null")
    return (
      <div>
        <Login />
      </div>
    );
  }


  return (
    <div>
      <UserSideMenu open={false} />
      <LandingPage />
    </div>
  )
}



/* <ul>
        {events.map((event: any) => {
          return <Article event={event} />
        })}
      </ul> */

// subscribe takes in a list of filters and relays and says 
  // // for these relays and these filters I will give you
  // // back events and let you know when I am done or do something when
  // // it is done
  // const { subscribe, relayUrl, activeRelay } = useContext(RelayContext);
  // const [events, setEvents] = useState<any>([]);

  // const getEvents = () => {

  //   const filter = {
  //     kinds: [30023],
  //     limit: 10,
  //   };

  //   let newEvents: any[] = [];

  //   const onEvent = (event: any) => {
  //     newEvents.push(event);
  //   };

  //   const onEOSE = () => {
  //     setEvents(newEvents);
  //   };

  //   subscribe([relayUrl], filter, onEvent, onEOSE);
  // }

  // useEffect(() => {
  //   getEvents();
  // }, [relayUrl, activeRelay])
