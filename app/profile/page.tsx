'use client';

import Profile from '@/components/profile';
import { useStytchUser } from '@stytch/nextjs';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function ProfilePage() {
  const { isInitialized, user } = useStytchUser();

  const router = useRouter();

  useEffect(() => {
    if (isInitialized && !user) {
      router.replace('/');
    }
  }, [isInitialized, router, user]);

  return <Profile />;
}
