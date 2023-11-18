'use client';

import { StytchProvider as ProviderActual } from '@stytch/nextjs';
import { createStytchUIClient } from '@stytch/nextjs/ui';
import type { ReactNode } from 'react';

const stytch = createStytchUIClient(
  process.env.NEXT_PUBLIC_STYTCH_PUBLIC_TOKEN!,
);

type Props = {
  children: ReactNode;
};

export default function StytchProvider({ children }: Props) {
  return <ProviderActual stytch={stytch}>{children}</ProviderActual>;
}
