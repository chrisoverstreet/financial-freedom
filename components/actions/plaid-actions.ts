'use server';

import plaid from '@/lib/plaid';
import { CountryCode, PaymentAmountCurrency, Products } from 'plaid';
import { z } from 'zod';

let ACCESS_TOKEN: string | undefined;
let ITEM_ID: string | undefined;
const PLAID_PRODUCTS = z
  .array(z.nativeEnum(Products))
  .parse((process.env.PLAID_PRODUCTS || Products.Transactions).split(','));
const PLAID_CLIENT_ID = process.env.PLAID_CLIENT_ID!;
const PLAID_SECRET = process.env.PLAID_SECRET!;
const PLAID_COUNTRY_CODES = z
  .array(z.nativeEnum(CountryCode))
  .parse((process.env.PLAID_COUNTRY_CODES || 'US').split(','));
const PLAID_REDIRECT_URI = process.env.PLAID_REDIRECT_URI || '';
let PAYMENT_ID = null;

export async function createLinkToken(userId: string) {
  const createTokenResponse = await plaid.linkTokenCreate({
    user: {
      client_user_id: userId,
    },
    client_name: 'Financial Freedom',
    products: PLAID_PRODUCTS,
    country_codes: PLAID_COUNTRY_CODES,
    language: 'en',
    redirect_uri: PLAID_REDIRECT_URI || undefined,
  });

  return createTokenResponse.data;
}

export async function createLinkTokenForPayment(userId: string) {
  const createRecipientResponse = await plaid.paymentInitiationRecipientCreate({
    name: 'Harry Potter',
    iban: 'GB33BUKB20201555555555',
    address: {
      street: ['4 Privet Drive'],
      city: 'Little Whinging',
      postal_code: '11111',
      country: 'GB',
    },
  });
  const recipientId = createRecipientResponse.data.recipient_id;

  const createPaymentResponse = await plaid.paymentInitiationPaymentCreate({
    recipient_id: recipientId,
    reference: 'paymentRef',
    amount: {
      value: 1.23,
      currency: PaymentAmountCurrency.Gbp,
    },
  });
  const paymentId = createPaymentResponse.data.payment_id;

  PAYMENT_ID = paymentId;

  const createTokenResponse = await plaid.linkTokenCreate({
    client_name: 'Financial Freedom',
    user: {
      client_user_id: userId,
    },
    country_codes: PLAID_COUNTRY_CODES,
    language: 'en',
    products: [Products.PaymentInitiation],
    payment_initiation: {
      payment_id: paymentId,
    },
    redirect_uri: PLAID_REDIRECT_URI || undefined,
  });
  return createTokenResponse.data;
}

export async function getAccounts() {
  if (!ACCESS_TOKEN) {
    throw new Error('No access token');
  }

  return plaid
    .accountsGet({
      access_token: ACCESS_TOKEN,
      client_id: PLAID_CLIENT_ID,
      secret: PLAID_SECRET,
    })
    .then((res) => res.data);
}

export async function getInfo() {
  return {
    item_id: ITEM_ID,
    access_token: ACCESS_TOKEN,
    products: PLAID_PRODUCTS,
  };
}

export async function setAccessToken(publicToken: string) {
  try {
    const tokenResponse = await plaid.itemPublicTokenExchange({
      public_token: publicToken,
    });
    console.log(tokenResponse);
    ACCESS_TOKEN = tokenResponse.data.access_token;
    ITEM_ID = tokenResponse.data.item_id;

    return {
      access_token: ACCESS_TOKEN,
      item_id: ITEM_ID,
      error: null,
    };
  } catch (e) {
    return {
      error:
        e instanceof Error ? e.message : null ?? 'Failed to set access token',
    };
  }
}
