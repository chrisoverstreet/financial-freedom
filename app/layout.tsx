import Header from '@/components/Header';
import StytchProvider from '@/components/StytchProvider';
import ThemeRegistry from '@/components/ThemeRegistry/ThemeRegistry';
import type { ReactNode } from 'react';

type Props = {
  children: ReactNode;
};

export const metadata = {
  title: 'Financial Freedom',
  description: 'Financial Freedom',
};

export default function RootLayout({ children }: Props) {
  return (
    <StytchProvider>
      <html lang='en'>
        <body>
          <ThemeRegistry>
            <Header />
            <main>
              <div>{children}</div>
            </main>
          </ThemeRegistry>
        </body>
      </html>
    </StytchProvider>
  );
}
