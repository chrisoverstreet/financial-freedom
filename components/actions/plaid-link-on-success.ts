'use server';

import { getUserId } from '@/components/actions/get-user-id';
import plaid from '@/lib/plaid';
import prisma from '@/lib/prisma';
import { CountryCode } from 'plaid';

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

  if (!institutionId) {
    throw new Error('Failed to find institution');
  }

  const {
    data: { institution },
  } = await plaid.institutionsGetById({
    institution_id: institutionId,
    secret: process.env.PLAID_SECRET!,
    client_id: process.env.PLAID_CLIENT_ID,
    country_codes: [CountryCode.Us],
  });

  const {
    data: { accounts },
  } = await plaid.accountsGet({
    access_token: accessToken,
    secret: process.env.PLAID_SECRET!,
    client_id: process.env.PLAID_CLIENT_ID!,
  });

  await prisma.$transaction(async (trx) => {
    const plaidInstitution = await trx.plaidInstitution.upsert({
      create: {
        plaidId: institution.institution_id,
        name: institution.name,
        logo: institution.logo,
        primaryColor: institution.primary_color,
        url: institution.url,
      },
      update: {
        name: institution.name,
        logo: institution.logo,
        primaryColor: institution.primary_color,
        url: institution.url,
      },
      where: {
        plaidId: institution.institution_id,
      },
    });

    const plaidItem = await trx.plaidItem.upsert({
      create: {
        userId,
        accessToken,
        plaidId: itemId,
        institutionId: plaidInstitution.id,
      },
      update: {
        accessToken,
        institutionId: plaidInstitution.id,
      },
      where: {
        plaidId: itemId,
        Institution: {
          plaidId: institution.institution_id,
        },
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
