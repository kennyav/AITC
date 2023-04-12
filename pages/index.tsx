import { useContext, useEffect, useState } from "react";
import { RelayContext } from "../context/relay-provider";
import { useSelector } from "react-redux";
import { RootState } from "../globalRedux/store";

// components
import Chart from "../components/MainPage";
import UserSideMenu from "../components/UserSideMenu";
import Login from "./section/login";


export default function Home() {
  // subscribe takes in a list of filters and relays and says 
  // for these relays and these filters I will give you 
  // back events and let you know when I am done or do something when
  // it is done
  const { subscribe, relayUrl, activeRelay } = useContext(RelayContext);
  const [events, setEvents] = useState<any>([]);
  const isAuthenticated = useSelector((state: RootState) => state.login.value);

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
      // if (newEvents.length === 0) {
      //   setEvents([]);
      //   return;
      // }
    };

    subscribe([relayUrl], filter, onEvent, onEOSE);
  }

  useEffect(() => {
    getEvents();
  }, [relayUrl, activeRelay])

  
  return (
    <main>
      {isAuthenticated ?
        <div>
          <Chart />
          <UserSideMenu open={true} />
        </div>
        : <Login />}

      {/* <ul>
        {events.map((event: any) => {
          return <Article event={event} />
        })}
      </ul> */}

    </main>
  )
}
