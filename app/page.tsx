'use server';

import AccountsList from '@/components/AccountsList';
import Container from '@mui/material/Container';
import Stack from '@mui/material/Stack';
import { Suspense } from 'react';

export default async function HomePage() {
  return (
    <Container>
      <Stack>
        <Suspense>
          <AccountsList />
        </Suspense>
      </Stack>
    </Container>
  );
}
