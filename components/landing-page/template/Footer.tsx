import Link from 'next/link';

import Background from '../background/Background';
import CenteredFooter from '../footer/CenteredFooter';
import Section from '../layout/Section';
import { Logo } from './Logo';

export default function Footer() {
  return (
    <Background color="bg-gray-100">
      <Section>
        <CenteredFooter logo={<Logo />} iconList={undefined} >
        </CenteredFooter>
      </Section>
    </Background>
  );

}