'use client';

import Button from '@mui/material/Button';
import { useStytch } from '@stytch/nextjs';
import { useRouter } from 'next/navigation';

export default function LogOutButton() {
  const stytch = useStytch();

  const router = useRouter();

  return (
    <Button onClick={onClick} variant='contained'>
      Log Out
    </Button>
  );

  function onClick() {
    stytch.session.revoke().then(() => {
      router.push('/login');
    });
  }
}
