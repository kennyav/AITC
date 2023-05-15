// components
import { useEffect, useRef, useState } from "react";
import UserSideMenu from "../components/UserSideMenu";
import LandingPage from "./section/landing-page";

// nostr imports 
import { Metadata } from "@/utils/parseData";
import { useRelayPool } from "@/context/use-relays-pool";
import { useDebounce } from "use-debounce";
import { Event } from "nostr-tools";
import { Relays } from "../context/relays";
import { updateData } from "@/data/parseData";

export default function Home() {
  return (
    <div>
      <UserSideMenu open={false} />
      <LandingPage />
    </div>
  )
}
