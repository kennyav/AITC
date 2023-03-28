import Link from 'next/link';

import Background from '../background/Background';
import Button from '../button/Button';
import HeroOneButton from '../hero/HeroOneButton';
import Section from '../layout/Section';
import NavbarTwoColumns from '../navigation/NavbarTwoColumns';
import { Logo } from './Logo';

export default function Hero() {

  return (
    <div className='bg-gray-100 py-12'>
      <div className="translate-x-3/4">
        <Logo xl />
      </div>

      <Section yPadding="pt-20 pb-32">
        <HeroOneButton
          title={<>
            {'The Artificial Intelligence\n'}
            <span>Trust Council</span>
            {/* <span className="bg-gradient-to-r from-blue-600 via-green-500 to-indigo-400 inline-block text-transparent bg-clip-text">Trust Council</span> */}
          </>}
          description='Polling. Trust. Social. Transparency. Privacy.' button={undefined} />
      </Section>
    </div>
  );
}

