'use server';

import getUserIdOrThrow from '@/actions/get-user-id';
import plaid from '@/lib/plaid';
import { CountryCode, Products } from 'plaid';
import { z } from 'zod';

const PLAID_PRODUCTS = z
  .array(z.nativeEnum(Products))
  .parse((process.env.PLAID_PRODUCTS || Products.Transactions).split(','));
const PLAID_COUNTRY_CODES = z
  .array(z.nativeEnum(CountryCode))
  .parse((process.env.PLAID_COUNTRY_CODES || 'US').split(','));
const PLAID_REDIRECT_URI = process.env.PLAID_REDIRECT_URI || '';

export default async function getPlaidLinkToken() {
  const userId = await getUserIdOrThrow();

  return plaid
    .linkTokenCreate({
      user: {
        client_user_id: userId,
      },
      client_name: 'Financial Freedom',
      products: PLAID_PRODUCTS,
      country_codes: PLAID_COUNTRY_CODES,
      language: 'en',
      redirect_uri: PLAID_REDIRECT_URI || undefined,
    })
    .then((res) => res.data.link_token);
}
