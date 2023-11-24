'use server';

import { authOptions } from '@/lib/next-auth';
import prisma from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import { cache } from 'react';

const getTransactions = cache(async () => {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    return [];
  }

  return prisma.plaidTransaction.findMany({
    select: {
      transactionId: true,
      name: true,
      datetime: true,
      amount: true,
      website: true,
      logoUrl: true,
    },
    where: {
      Account: {
        Item: {
          userId: session.user.id,
        },
      },
    },
    take: 100,
    orderBy: {
      datetime: 'desc',
    },
  });
});

export default getTransactions;
