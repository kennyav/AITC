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
            {'The modern analysis for\n'}
            <span className="bg-gradient-to-r from-blue-600 via-green-500 to-indigo-400 inline-block text-transparent bg-clip-text">the Transparent Future</span>
          </>}
          description='The easiest way to organize your data where you have all the power. We introduce AITC, the first decentralized AI-powered data analysis tool that helps you to make better decisions.' button={undefined} />
      </Section>
    </div>
  );
}

