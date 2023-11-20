'use server';

import { getUserId } from '@/components/actions/get-user-id';
import prisma from '@/lib/prisma';

export async function getAccounts() {
  const userId = await getUserId();

  if (!userId) {
    return [];
  }

  return prisma.plaidItem.findMany({
    where: {
      userId,
    },
    select: {
      id: true,
      institutionId: true,
      Accounts: {
        select: {
          id: true,
          name: true,
          currentBalance: true,
          availableBalance: true,
        },
      },
    },
  });
}
