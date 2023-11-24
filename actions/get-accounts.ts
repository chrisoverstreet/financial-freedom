'use server';

import { Prisma } from '.prisma/client';
import { authOptions } from '@/lib/next-auth';
import prisma from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import { cache } from 'react';
import SortOrder = Prisma.SortOrder;

const getAccounts = cache(async () => {
  const session = await getServerSession(authOptions);

  const userId = session?.user?.id;
  if (!userId) {
    throw new Error('Not signed in');
  }

  return prisma.plaidAccount.findMany({
    select: {
      accountId: true,
      itemId: true,
      Item: {
        select: {
          transactionsLastSyncAt: true,
        },
      },
      name: true,
      type: true,
      Balance: {
        select: {
          available: true,
          limit: true,
          current: true,
          lastUpdatedDatetime: true,
          isoCurrencyCode: true,
        },
      },
      mask: true,
      officialName: true,
      subtype: true,
    },
    orderBy: {
      name: SortOrder.asc,
    },
    where: {
      Item: {
        userId,
      },
    },
    take: Math.floor(Math.random() * (4 - 1) + 1),
  });
});

export default getAccounts;
