'use server';

import plaid from '@/lib/plaid';
import prisma from '@/lib/prisma';

const PAGE_COUNT = 500;

export async function syncTransactions(itemId: string) {
  const { accessToken } = await prisma.plaidItem.findFirstOrThrow({
    select: {
      accessToken: true,
      itemId: true,
    },
    where: {
      itemId,
    },
  });

  let cursor: string | undefined;
  let hasMore: boolean;

  do {
    const res = await plaid.transactionsSync({
      access_token: accessToken,
      client_id: process.env.PLAID_CLIENT_ID!,
      secret: process.env.PLAID_SECRET!,
      count: PAGE_COUNT,
      cursor,
    });

    for (const added of res.data.added) {
      await prisma.plaidTransaction.create({
        data: {
          Location: {
            create: {
              city: added.location.city,
              lat: added.location.lat,
              lon: added.location.lon,
              address: added.location.address,
              country: added.location.country,
              region: added.location.region,
              postalCode: added.location.postal_code,
              storeNumber: added.location.store_number,
            },
          },
          PaymentMeta: {
            create: {
              payee: added.payment_meta.payee,
              payer: added.payment_meta.payer,
              paymentMethod: added.payment_meta.payment_method,
              paymentProcessor: added.payment_meta.payment_processor,
              ppdId: added.payment_meta.ppd_id,
              reason: added.payment_meta.reason,
              byOrderOf: added.payment_meta.by_order_of,
              referenceNumber: added.payment_meta.reference_number,
            },
          },
          Account: {
            connect: {
              accountId: added.account_id,
            },
          },
          accountOwner: added.account_owner,
          amount: added.amount,
          authorizedDate: added.authorized_date,
          authorizedDatetime: added.authorized_datetime,
          checkNumber: added.check_number,
          date: added.date,
          datetime: added.datetime,
          isoCurrencyCode: added.iso_currency_code,
          logoUrl: added.logo_url,
          merchantName: added.merchant_name,
          name: added.name,
          originalDescription: added.original_description,
          paymentChannel: added.payment_channel,
          pending: added.pending,
          pendingTransactionId: added.pending_transaction_id,
          PersonalFinanceCategory: added.personal_finance_category
            ? {
                create: {
                  primary: added.personal_finance_category.primary,
                  detailed: added.personal_finance_category.detailed,
                  confidenceLevel:
                    added.personal_finance_category.confidence_level,
                },
              }
            : undefined,
          personalFinanceCategoryIconUrl:
            added.personal_finance_category_icon_url,
          transactionId: added.transaction_id,
          transactionCode: added.transaction_code,
          unofficialCurrencyCode: added.unofficial_currency_code,
          website: added.website,
        },
      });
    }

    for (const modified of res.data.modified) {
      await prisma.plaidTransaction.update({
        data: {
          name: modified.name,
          originalDescription: modified.original_description,
          paymentChannel: modified.payment_channel,
          pending: modified.pending,
          pendingTransactionId: modified.pending_transaction_id,
          PersonalFinanceCategory: modified.personal_finance_category
            ? {
                upsert: {
                  create: {
                    primary: modified.personal_finance_category.primary,
                    detailed: modified.personal_finance_category.detailed,
                    confidenceLevel:
                      modified.personal_finance_category.confidence_level,
                  },
                  update: {
                    primary: modified.personal_finance_category.primary,
                    detailed: modified.personal_finance_category.detailed,
                    confidenceLevel:
                      modified.personal_finance_category.confidence_level,
                  },
                },
              }
            : undefined,
          Account: {
            connect: {
              accountId: modified.account_id,
            },
          },
          personalFinanceCategoryIconUrl:
            modified.personal_finance_category_icon_url,
          transactionCode: modified.transaction_code,
          unofficialCurrencyCode: modified.unofficial_currency_code,
          website: modified.website,
          amount: modified.amount,
          authorizedDate: modified.authorized_date,
          authorizedDatetime: modified.authorized_datetime,
          checkNumber: modified.check_number,
          date: modified.date,
          datetime: modified.datetime,
          isoCurrencyCode: modified.iso_currency_code,
          logoUrl: modified.logo_url,
          merchantName: modified.merchant_name,
          accountOwner: modified.account_owner,
          PaymentMeta: {
            upsert: {
              create: {
                payee: modified.payment_meta.payee,
                payer: modified.payment_meta.payer,
                paymentMethod: modified.payment_meta.payment_method,
                paymentProcessor: modified.payment_meta.payment_processor,
                ppdId: modified.payment_meta.ppd_id,
                reason: modified.payment_meta.reason,
                byOrderOf: modified.payment_meta.by_order_of,
                referenceNumber: modified.payment_meta.reference_number,
              },
              update: {
                payee: modified.payment_meta.payee,
                payer: modified.payment_meta.payer,
                paymentMethod: modified.payment_meta.payment_method,
                paymentProcessor: modified.payment_meta.payment_processor,
                ppdId: modified.payment_meta.ppd_id,
                reason: modified.payment_meta.reason,
                byOrderOf: modified.payment_meta.by_order_of,
                referenceNumber: modified.payment_meta.reference_number,
              },
            },
          },
          Location: {
            upsert: {
              create: {
                city: modified.location.city,
                lat: modified.location.lat,
                lon: modified.location.lon,
                address: modified.location.address,
                country: modified.location.country,
                region: modified.location.region,
                postalCode: modified.location.postal_code,
                storeNumber: modified.location.store_number,
              },
              update: {
                city: modified.location.city,
                lat: modified.location.lat,
                lon: modified.location.lon,
                address: modified.location.address,
                country: modified.location.country,
                region: modified.location.region,
                postalCode: modified.location.postal_code,
                storeNumber: modified.location.store_number,
              },
            },
          },
        },
        where: {
          transactionId: modified.transaction_id,
        },
      });
    }

    if (res.data.removed.length) {
      await prisma.plaidTransaction.deleteMany({
        where: {
          transactionId: {
            in: res.data.removed.map(
              (removed) => removed.transaction_id ?? 'fallback-bogus-id',
            ),
          },
        },
      });
    }

    cursor = res.data.next_cursor;
    hasMore = res.data.has_more;
  } while (hasMore && !!cursor);

  await prisma.plaidItem.update({
    data: {
      transactionsLastSyncAt: new Date(),
    },
    where: {
      accessToken,
    },
  });
}
