'use server';

import getUserIdOrThrow from '@/actions/get-user-id';
import LogOutButton from '@/components/LogOutButton';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import { Suspense } from 'react';

export default async function Header() {
  const user = await getUserIdOrThrow().catch(() => null);

  return (
    <AppBar position='sticky'>
      <Toolbar>
        <Typography variant='h6'>Financial Freedom</Typography>
        {!!user && (
          <>
            <Typography>{user}</Typography>
            <Suspense>
              <LogOutButton />
            </Suspense>
          </>
        )}
      </Toolbar>
    </AppBar>
  );
}
