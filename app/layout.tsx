'use server';

import Header from '@/components/Header';
import StytchProvider from '@/components/StytchProvider';
import ThemeRegistry from '@/components/ThemeRegistry/ThemeRegistry';
import { PlaidProvider } from '@/contexts/PlaidContext';
import type { ReactNode } from 'react';

type Props = {
  children?: ReactNode | undefined;
};

// export const metadata = {
//   title: 'Financial Freedom',
//   description: 'Financial Freedom',
// };

export default async function RootLayout({ children }: Props) {
  return (
    <StytchProvider>
      <html lang='en'>
        <body>
          <ThemeRegistry>
            <PlaidProvider>
              <Header />
              <main>{children}</main>
            </PlaidProvider>
          </ThemeRegistry>
        </body>
      </html>
    </StytchProvider>
  );
}
