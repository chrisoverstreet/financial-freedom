'use client';

import useUser from '@/hooks/use-user';
import { useStytch } from '@stytch/nextjs';

export default function Profile() {
  const stytch = useStytch();

  const user = useUser();

  return (
    <div>
      {user && <pre>{JSON.stringify(user, null, `\t`)}</pre>}
      <button onClick={() => stytch.session.revoke()}>Log out</button>
    </div>
  );
}
