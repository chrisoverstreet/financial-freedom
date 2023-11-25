'use server';

import { authOptions } from '@/lib/next-auth';
import prisma from '@/lib/prisma';
import { PlaidAccountType } from '@prisma/client';
import { getServerSession } from 'next-auth';
import { cache } from 'react';

const getTotalAssets = cache(async () => {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    throw new Error('Not signed in');
  }

  const { _sum } = await prisma.plaidBalance.aggregate({
    _sum: {
      current: true,
    },
    where: {
      PlaidAccount: {
        every: {
          type: {
            in: [
              PlaidAccountType.investment,
              PlaidAccountType.depository,
              PlaidAccountType.brokerage,
            ],
          },
          Item: {
            userId: session.user.id,
          },
        },
      },
    },
  });

  return _sum.current ?? 0;
});

export default getTotalAssets;
