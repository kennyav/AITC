import Banner from '../../components/landing-page/template/Banner';
import Footer from '../../components/landing-page/template/Footer';
import Hero from '../../components/landing-page/template/Hero';
import { VerticalFeatures } from '../../components/landing-page/template/VerticalFeatures';
import UserSideMenu from '../../components/UserSideMenu';

export default function LandingPage() {

   return (
      <div className="antialiased text-gray-600 overflow-x-hidden">
         <UserSideMenu open={false}/>
         <Hero />
         <VerticalFeatures />
         <Banner />
         <Footer />
      </div>
   )
};

