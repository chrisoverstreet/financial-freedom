import loadStytch from '@/lib/loadStytch';
import prisma from '@/lib/prisma';
import { cookies } from 'next/headers';

export async function getUserId() {
  const sessionToken = cookies().get('stytch_session')?.value;

  if (!sessionToken) {
    return null;
  }

  const stytch = loadStytch();
  const {
    user: { user_id: stytchUserId },
  } = await stytch.sessions.authenticate({
    session_token: sessionToken,
  });

  return prisma.user
    .findFirstOrThrow({
      select: {
        id: true,
      },
      where: {
        stytchId: stytchUserId,
      },
    })
    .then((user) => user.id);
}
