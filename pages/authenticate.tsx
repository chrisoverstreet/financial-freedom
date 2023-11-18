import { useStytch, useStytchUser } from '@stytch/nextjs';
import { useRouter } from 'next/router';
import { useEffect } from 'react';

const OAUTH_TOKEN = 'oauth';
const MAGIC_LINKS_TOKEN = 'magic_links';

const Authenticate = () => {
  const { isInitialized, user } = useStytchUser();
  const stytch = useStytch();
  const router = useRouter();

  useEffect(() => {
    if (stytch && !user && isInitialized) {
      const stytch_token_type = router?.query.stytch_token_type?.toString();
      const token = router?.query.token?.toString();

      if (token && stytch_token_type === OAUTH_TOKEN) {
        stytch.oauth.authenticate(token, {
          session_duration_minutes: 60,
        });
      } else if (token && stytch_token_type === MAGIC_LINKS_TOKEN) {
        stytch.magicLinks.authenticate(token, {
          session_duration_minutes: 60,
        });
      }
    }
  }, [
    isInitialized,
    router?.query.stytch_token_type,
    router?.query.token,
    stytch,
    user,
  ]);

  useEffect(() => {
    if (!isInitialized) {
      return;
    }
    if (user) {
      router.replace('/profile');
    }
  }, [isInitialized, router, user]);

  return null;
};

export default Authenticate;
