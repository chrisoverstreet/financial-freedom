'use server';

import { authOptions } from '@/app/api/auth/[...nextauth]/route';
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
      <Stack>TODO</Stack>
      {/*<Stack>*/}
      {/*  <Suspense>*/}
      {/*    <AccountsList />*/}
      {/*  </Suspense>*/}
      {/*</Stack>*/}
    </Container>
  );
}
