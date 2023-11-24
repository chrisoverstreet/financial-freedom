'use client';

import { syncTransactions } from '@/actions/sync-transactions';
import SyncIcon from '@mui/icons-material/Sync';
import IconButton from '@mui/material/IconButton';
import { useState } from 'react';

type Props = {
  itemId: string;
};

export function SyncTransactionsListItemButton({ itemId }: Props) {
  const [syncing, setSyncing] = useState(false);

  return (
    <IconButton disabled={syncing} onClick={onClick}>
      <SyncIcon />
    </IconButton>
  );
  async function onClick() {
    setSyncing(true);
    await syncTransactions(itemId).finally(() => setSyncing(false));
  }
}
