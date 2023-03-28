import Link from 'next/link';

import Background from '../background/Background';
import CenteredFooter from '../footer/CenteredFooter';
import Section from '../layout/Section';
import { Logo } from './Logo';

export default function Footer() {
  return (
    <Background color="bg-gray-100">
      <Section>
        <div className='text-center'>
          <h1>AITC</h1>
          <h1>Together, we give trust at home.</h1>
        </div>
      </Section>
    </Background>
  );

}