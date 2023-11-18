'use client';

import Login from '@/components/Login';
import { useStytchUser } from '@stytch/nextjs';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function LoginPage() {
  const { isInitialized, user } = useStytchUser();

  const router = useRouter();

  useEffect(() => {
    if (isInitialized && user) {
      router.replace('/profile');
    }
  }, [isInitialized, router, user]);

  return <Login />;
}
