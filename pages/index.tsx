// components
import UserSideMenu from "../components/UserSideMenu";
import LandingPage from "./section/landing-page";

export default function Home() {
  return (
    <div>
      <UserSideMenu open={false} />
      <LandingPage />
    </div>
  )
}
