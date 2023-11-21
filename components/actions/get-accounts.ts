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
      Accounts: {
        select: {
          availableBalance: true,
          currentBalance: true,
          id: true,
          name: true,
          Item: {
            select: {
              Institution: {
                select: {
                  id: true,
                  logo: true,
                  name: true,
                  primaryColor: true,
                  url: true,
                },
              },
            },
          },
        },
      },
    },
  });
}
