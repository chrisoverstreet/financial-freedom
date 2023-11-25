'use client';

import SyncIcon from '@mui/icons-material/Sync';
import IconButton from '@mui/material/IconButton';
import { useState } from 'react';

type Props = {
  sync: Function;
};

export function SyncTransactionsListItemButton({ sync }: Props) {
  const [syncing, setSyncing] = useState(false);

  return (
    <IconButton disabled={syncing} onClick={onClick}>
      <SyncIcon />
    </IconButton>
  );
  async function onClick() {
    setSyncing(true);
    await sync().finally(() => setSyncing(false));
  }
}
