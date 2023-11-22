'use server';

import { Prisma } from '.prisma/client';
import prisma from '@/lib/prisma';
import { cache } from 'react';
import SortOrder = Prisma.SortOrder;

const getAccounts = cache(async () => {
  return prisma.plaidAccount.findMany({
    select: {
      accountId: true,
      name: true,
      type: true,
      Balances: {
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
  });
});

export default getAccounts;
