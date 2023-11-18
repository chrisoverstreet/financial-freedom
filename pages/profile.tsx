import Profile from '@/components/profile';
import loadStytch from '@/lib/loadStytch';
import { useStytchUser } from '@stytch/nextjs';
import type { GetServerSidePropsContext } from 'next';
import { useRouter } from 'next/router';
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

export async function getServerSideProps({ req }: GetServerSidePropsContext) {
  const redirectRes = {
    redirect: {
      destination: '/',
      permanent: false,
    },
  };

  const sessionJWT = req.cookies['stytch_session_jwt'];

  if (!sessionJWT) {
    return redirectRes;
  }

  const stytchClient = loadStytch();

  try {
    await stytchClient.sessions.authenticateJwt({ session_jwt: sessionJWT });
    return { props: {} };
  } catch (e) {
    return redirectRes;
  }
}
