import type { AppProps } from 'next/app';
import { MixNMatchProvider } from '@/contexts/MixNMatchContext';

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <MixNMatchProvider>
      <Component {...pageProps} />
    </MixNMatchProvider>
  );
}

export default MyApp;