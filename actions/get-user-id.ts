'use server';

import loadStytch from '@/lib/loadStytch';
import prisma from '@/lib/prisma';
import { cookies } from 'next/headers';
import { cache } from 'react';

const getUserIdOrThrow = cache(async () => {
  const sessionToken = cookies().get('stytch_session')?.value;

  if (!sessionToken) {
    throw new Error('Not signed in');
  }

  const stytch = loadStytch();

  const {
    session: { custom_claims: customClaims },
    user: { user_id: stytchId, emails, name },
  } = await stytch.sessions.authenticate({
    session_token: sessionToken,
  });

  if (customClaims && 'userId' in customClaims && customClaims.userId) {
    return customClaims.userId;
  }

  let userId;

  await prisma.user
    .findFirst({
      where: {
        stytchId,
      },
      select: {
        id: true,
      },
    })
    .then((user) => (userId = user?.id));

  if (!userId) {
    await prisma.user
      .create({
        data: {
          stytchId,
          firstName: name?.first_name,
          lastName: name?.last_name,
          email: emails.find((email) => email.verified)?.email,
        },
        select: {
          id: true,
        },
      })
      .then((user) => (userId = user.id));
  }

  await stytch.users.update({
    user_id: stytchId,
    trusted_metadata: {
      userId,
    },
  });

  return userId;
});

export default getUserIdOrThrow;
