'use server';

import AccountsList from '@/components/AccountsList';
import AddAccountButton from '@/components/AddAccountButton';
import { authOptions } from '@/lib/next-auth';
import Container from '@mui/material/Container';
import Stack from '@mui/material/Stack';
import { getServerSession } from 'next-auth';
import { redirect } from 'next/navigation';

export default async function HomePage() {
  const session = await getServerSession(authOptions);

  if (!session?.user) {
    return redirect('/welcome');
  }

  return (
    <Container>
      <Stack gap={4} sx={{ py: 4 }}>
        <AddAccountButton />
        <AccountsList />
      </Stack>
    </Container>
  );
}
