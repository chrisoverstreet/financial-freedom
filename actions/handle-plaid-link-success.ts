'use server';

import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import plaid from '@/lib/plaid';
import prisma from '@/lib/prisma';
import {
  PlaidAccountType,
  PlaidProduct,
  PlaidVerificationStatus,
} from '@prisma/client';
import { getServerSession } from 'next-auth';
import { CountryCode } from 'plaid';
import { z } from 'zod';

export async function handlePlaidLinkSuccess(publicToken: string) {
  const session = await getServerSession(authOptions);

  const userId = session?.user?.id;
  if (!userId) {
    throw new Error('Not signed in');
  }

  const {
    data: { access_token: accessToken, item_id: itemId },
  } = await plaid.itemPublicTokenExchange({ public_token: publicToken });

  const { data: itemData } = await plaid.itemGet({
    access_token: accessToken,
    client_id: process.env.PLAID_CLIENT_ID!,
    secret: process.env.PLAID_SECRET!,
  });

  if (!itemData.item.institution_id) {
    throw new Error('Unsupported institution');
  }

  const { data: institutionData } = await plaid.institutionsGetById({
    client_id: process.env.PLAID_CLIENT_ID!,
    country_codes: [CountryCode.Us],
    institution_id: itemData.item.institution_id,
    secret: process.env.PLAID_SECRET!,
  });

  const { data: accountsData } = await plaid.accountsGet({
    access_token: accessToken,
    client_id: process.env.PLAID_CLIENT_ID!,
    secret: process.env.PLAID_SECRET!,
  });

  await prisma.$transaction(async (trx) => {
    await trx.plaidInstitution.upsert({
      create: {
        name: institutionData.institution.name,
        logo: institutionData.institution.logo,
        institutionId: institutionData.institution.institution_id,
        countryCodes: institutionData.institution.country_codes,
        oauth: institutionData.institution.oauth,
        url: institutionData.institution.url,
        dtcNumbers: institutionData.institution.dtc_numbers,
        products: z
          .array(z.nativeEnum(PlaidProduct))
          .parse(institutionData.institution.products),
        primary_color: institutionData.institution.primary_color,
        routingNumbers: institutionData.institution.routing_numbers,
      },
      update: {
        name: institutionData.institution.name,
        logo: institutionData.institution.logo,
        countryCodes: institutionData.institution.country_codes,
        oauth: institutionData.institution.oauth,
        url: institutionData.institution.url,
        dtcNumbers: institutionData.institution.dtc_numbers,
        products: z
          .array(z.nativeEnum(PlaidProduct))
          .parse(institutionData.institution.products),
        primary_color: institutionData.institution.primary_color,
        routingNumbers: institutionData.institution.routing_numbers,
      },
      where: {
        institutionId: institutionData.institution.institution_id,
      },
    });

    await trx.plaidItem.create({
      data: {
        itemId: itemData.item.item_id,
        institutionId: itemData.item.institution_id,
        userId,
        products: z
          .array(z.nativeEnum(PlaidProduct))
          .parse(itemData.item.products),
        webhook: itemData.item.webhook,
        billedProducts: z
          .array(z.nativeEnum(PlaidProduct))
          .parse(itemData.item.billed_products),
        availableProducts: z
          .array(z.nativeEnum(PlaidProduct))
          .parse(itemData.item.available_products),
        consentedProducts: z
          .array(z.nativeEnum(PlaidProduct))
          .optional()
          .parse(itemData.item.consented_products),
        updateType: itemData.item.update_type,
        consentExpirationTime: itemData.item.consent_expiration_time,
      },
    });

    for (const account of accountsData.accounts) {
      await trx.plaidAccount.create({
        data: {
          name: account.name,
          subtype: account.subtype,
          type: z.nativeEnum(PlaidAccountType).parse(account.type),
          mask: account.mask,
          officialName: account.official_name,
          accountId: account.account_id,
          persistentAccountId: account.persistent_account_id,
          verificationStatus: z
            .nativeEnum(PlaidVerificationStatus)
            .optional()
            .parse(account.verification_status),
          Item: {
            connect: {
              itemId: itemData.item.item_id,
            },
          },
          Balance: {
            create: {
              available: account.balances.available,
              current: account.balances.current,
              limit: account.balances.limit,
              isoCurrencyCode: account.balances.iso_currency_code,
              lastUpdatedDatetime: account.balances.last_updated_datetime,
              unofficialCurrencyCode: account.balances.unofficial_currency_code,
            },
          },
        },
      });
    }
  });
}
