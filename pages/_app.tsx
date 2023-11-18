import { StytchProvider } from '@stytch/nextjs';
import { createStytchUIClient } from '@stytch/nextjs/ui';
import type { AppProps } from 'next/app';
import Head from 'next/head';

const stytch = createStytchUIClient(
  process.env.NEXT_PUBLIC_STYTCH_PUBLIC_TOKEN!,
);

export default function App({ Component, pageProps }: AppProps) {
  return (
    <>
      <Head>
        <title>Financial Freedom</title>
      </Head>
      <StytchProvider stytch={stytch}>
        <main>
          <Component {...pageProps} />
        </main>
      </StytchProvider>
    </>
  );
}
