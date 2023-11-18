import Header from '@/components/Header';
import StytchProvider from '@/components/StytchProvider';
import type { ReactNode } from 'react';
import './global.css';

type Props = {
  children: ReactNode;
};

export default function RootLayout({ children }: Props) {
  return (
    <StytchProvider>
      <html lang='en'>
        <title>Financial Freedom</title>
        <body>
          <Header />
          <main>
            <div>{children}</div>
          </main>
        </body>
      </html>
    </StytchProvider>
  );
}
