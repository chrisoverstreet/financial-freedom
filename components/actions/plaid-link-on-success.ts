'use server';

import { getUserId } from '@/components/actions/get-user-id';
import plaid from '@/lib/plaid';
import prisma from '@/lib/prisma';

export async function plaidLinkOnSuccess(
  publicToken: string,
  metadata: unknown,
) {
  const userId = await getUserId();
  if (!userId) {
    throw new Error('Must be signed in');
  }

  const {
    data: { access_token: accessToken, item_id: itemId },
  } = await plaid.itemPublicTokenExchange({ public_token: publicToken });

  const {
    data: {
      item: { institution_id: institutionId },
    },
  } = await plaid.itemGet({
    access_token: accessToken,
    secret: process.env.PLAID_SECRET!,
    client_id: process.env.PLAID_CLIENT_ID!,
  });

  const {
    data: { accounts },
  } = await plaid.accountsGet({
    access_token: accessToken,
    secret: process.env.PLAID_SECRET!,
    client_id: process.env.PLAID_CLIENT_ID!,
  });

  await prisma.$transaction(async (trx) => {
    const plaidItem = await trx.plaidItem.upsert({
      create: {
        userId,
        accessToken,
        institutionId,
        plaidId: itemId,
      },
      update: {
        accessToken,
        institutionId,
      },
      where: {
        plaidId: itemId,
      },
      select: {
        id: true,
      },
    });

    for (const account of accounts) {
      await trx.plaidAccount.upsert({
        create: {
          plaidId: account.account_id,
          name: account.name,
          currentBalance: account.balances.current,
          limit: account.balances.limit,
          availableBalance: account.balances.available,
          officialName: account.official_name,
          type: account.type,
          subtype: account.subtype,
          ISOCurrencyCode: account.balances.iso_currency_code,
          mask: account.mask,
          itemId: plaidItem.id,
        },
        update: {
          name: account.name,
          currentBalance: account.balances.current,
          limit: account.balances.limit,
          availableBalance: account.balances.available,
          officialName: account.official_name,
          type: account.type,
          subtype: account.subtype,
          ISOCurrencyCode: account.balances.iso_currency_code,
          mask: account.mask,
        },
        where: {
          plaidId: account.account_id,
        },
        select: {
          id: true,
        },
      });

      await trx.plaidAccount.deleteMany({
        where: {
          plaidId: {
            notIn: accounts.map((account) => account.account_id),
          },
          itemId: plaidItem.id,
        },
      });
    }
  });
}
