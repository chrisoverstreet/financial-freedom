'use server';

import { getUserId } from '@/components/actions/get-user-id';
import plaid from '@/lib/plaid';
import prisma from '@/lib/prisma';

export async function deleteAccount(accountId: number) {
  const userId = getUserId();

  if (!userId) {
    throw new Error('Must be signed in');
  }

  await prisma.$transaction(async (trx) => {
    const item = await trx.plaidItem.findFirstOrThrow({
      where: {
        Accounts: {
          some: {
            id: accountId,
          },
        },
      },
      select: {
        id: true,
        accessToken: true,
        Accounts: {
          select: {
            id: true,
          },
        },
      },
    });

    await trx.plaidAccount.delete({
      where: {
        id: accountId,
      },
    });

    if (!item.Accounts.some((account) => account.id !== accountId)) {
      await trx.plaidItem.delete({
        where: {
          id: item.id,
        },
      });

      await plaid.itemRemove({
        access_token: item.accessToken,
        client_id: process.env.PLAID_CLIENT_ID!,
        secret: process.env.PLAID_SECRET!,
      });
    }
  });
}
