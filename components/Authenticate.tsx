'use client';

import { useStytch, useStytchUser } from '@stytch/nextjs';
import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect } from 'react';

const OAUTH_TOKEN = 'oauth';
const MAGIC_LINKS_TOKEN = 'magic_links';

export default function Authenticate() {
  const { isInitialized, user } = useStytchUser();
  const stytch = useStytch();
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    if (stytch && !user && isInitialized) {
      const token = searchParams?.get('token');
      const stytch_token_type = searchParams?.get('stytch_token_type');

      if (token && stytch_token_type === OAUTH_TOKEN) {
        stytch.oauth.authenticate(token, { session_duration_minutes: 60 });
      } else if (token && stytch_token_type === MAGIC_LINKS_TOKEN) {
        stytch.magicLinks.authenticate(token, { session_duration_minutes: 60 });
      }
    }
  }, [isInitialized, searchParams, stytch, user]);

  useEffect(() => {
    if (!isInitialized) {
      return;
    }

    if (user) {
      router.replace('/profile');
    }
  }, [isInitialized, router, user]);

  return null;
}
