import { useContext, useEffect, useState } from "react";
import { RelayContext } from "../context/relay-provider";

// components
import Chart from "../components/MainPage";
import UserSideMenu from "../components/UserSideMenu";


export default function Home() {
  // subscribe takes in a list of filters and relays and says 
  // for these relays and these filters I will give you 
  // back events and let you know when I am done or do something when
  // it is done
  const { subscribe, relayUrl, activeRelay } = useContext(RelayContext);
  const [events, setEvents] = useState<any>([]);

  const getEvents = () => {

    const filter = {
      kinds: [30023],
      limit: 10,
    };

    let newEvents: any[] = [];

    const onEvent = (event: any) => {
      newEvents.push(event);
    };

    const onEOSE = () => {
      setEvents(newEvents);
    };

    subscribe([relayUrl], filter, onEvent, onEOSE);
  }

  useEffect(() => {
    getEvents();
  }, [relayUrl, activeRelay])

  
  return (
    <main>
        <div>
          <Chart />
          <UserSideMenu open={true} />
        </div>

      {/* <ul>
        {events.map((event: any) => {
          return <Article event={event} />
        })}
      </ul> */}

    </main>
  )
}
