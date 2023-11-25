'use sever';

import { authOptions } from '@/lib/next-auth';
import prisma from '@/lib/prisma';
import { PlaidAccountType } from '@prisma/client';
import { getServerSession } from 'next-auth';
import { cache } from 'react';

const getTotalLiabilities = cache(async () => {
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
              PlaidAccountType.loan,
              PlaidAccountType.credit,
              PlaidAccountType.other,
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

export default getTotalLiabilities;
