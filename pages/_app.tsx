import '@/styles/globals.css'
import type { AppProps } from 'next/app'

import '../styles/globals.css';
import Providers from '../context/providers';
import { ReduxProvider } from '../globalRedux/provider';
import { store } from '../globalRedux/store';
import { useEffect } from 'react';
import { allowedRoutes } from '../lib/constants';
import { useRouter } from 'next/router';

export const metadata = {
  title: 'Artificial Intelligence Trust Council',
  description: 'Generated by Kenneth Averna using create next app',
}

export default function App({ Component, pageProps }: AppProps) {
  const router = useRouter();

  useEffect(() => {
    const isAuthenticated = store.getState().login.value;
    const isAllowedRoute = allowedRoutes.includes(router.pathname);
    if (!isAuthenticated) {
      router.replace('/');
    }
  }, [router.pathname]);


  return (
    <ReduxProvider>
      <Providers>
          <Component {...pageProps} />
      </Providers>
    </ReduxProvider>
  )
}
