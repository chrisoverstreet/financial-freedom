'use client';

import { syncTransactions } from '@/actions/sync-transactions';
import Button from '@mui/material/Button';
import { useState } from 'react';

type Props = {
  itemId: string;
};

export function SyncTransactionsButton({ itemId }: Props) {
  const [syncing, setSyncing] = useState(false);

  return (
    <Button disabled={syncing} onClick={onClick}>
      Sync
    </Button>
  );
  async function onClick() {
    setSyncing(true);
    await syncTransactions(itemId).finally(() => setSyncing(false));
  }
}
