'use server';

import { getUserId } from '@/components/actions/get-user-id';
import plaid from '@/lib/plaid';
import prisma from '@/lib/prisma';

export async function setAccessToken(publicToken: string) {
  const userId = await getUserId();

  if (!userId) {
    return { access_token: null, item_id: null };
  }

  const {
    data: { access_token: accessToken, item_id, request_id },
  } = await plaid.itemPublicTokenExchange({
    public_token: publicToken,
  });

  await prisma.plaidItem.create({
    data: {
      accessToken,
      userId,
      plaidId: item_id,
    },
  });

  return { access_token: accessToken, item_id };
}
