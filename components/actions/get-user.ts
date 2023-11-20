'use server';

import { Prisma } from '.prisma/client';
import prisma from '@/lib/prisma';
import { useStytchUser } from '@stytch/nextjs';

const SELECT: Prisma.UserSelect = {
  id: true,
  firstName: true,
  lastName: true,
};

export async function getUser(
  stytchUser: ReturnType<typeof useStytchUser>['user'] | null,
) {
  if (!stytchUser) {
    return;
  }

  const existingUser = await prisma.user.findFirst({
    select: SELECT,
    where: {
      stytchId: stytchUser.user_id,
    },
  });

  if (existingUser) {
    return existingUser;
  }

  return prisma.user.create({
    data: {
      stytchId: stytchUser.user_id,
      email: stytchUser.emails[0].email,
      firstName: stytchUser.name?.first_name,
      lastName: stytchUser.name?.last_name,
    },
    select: SELECT,
  });
}
