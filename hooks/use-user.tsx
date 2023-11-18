'use client';

import { getUser } from '@/components/actions/get-user';
import { useStytchUser } from '@stytch/nextjs';
import { useEffect, useState } from 'react';

export default function useUser() {
  const [user, setUser] = useState<Awaited<ReturnType<typeof getUser>>>();

  const { user: stytchUser } = useStytchUser();

  useEffect(() => {
    const getUserWithStytchId = getUser.bind(null, stytchUser);

    getUserWithStytchId().then(setUser);
  }, [stytchUser]);

  return user;
}
