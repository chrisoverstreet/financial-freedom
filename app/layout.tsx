'use server';

import Header from '@/components/Header';
import SessionProvider from '@/components/SessionProvider';
import ThemeRegistry from '@/components/ThemeRegistry/ThemeRegistry';
import { PlaidProvider } from '@/contexts/PlaidContext';
import { authOptions } from '@/lib/next-auth';
import Box from '@mui/material/Box';
import { getServerSession } from 'next-auth';
import type { ReactNode } from 'react';

type Props = {
  children?: ReactNode | undefined;
};

export default async function RootLayout({ children }: Props) {
  const session = await getServerSession(authOptions);

  return (
    <html lang='en'>
      <body>
        <SessionProvider session={session}>
          <ThemeRegistry>
            <PlaidProvider>
              <main>
                <Header />
                <Box>{children}</Box>
              </main>
            </PlaidProvider>
          </ThemeRegistry>
        </SessionProvider>
      </body>
    </html>
  );
}
