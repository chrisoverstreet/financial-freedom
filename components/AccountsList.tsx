'use server';

import getAccounts from '@/actions/get-accounts';
import { SyncTransactionsButton } from '@/components/SyncTransactionsButton';
import { List, ListItem, ListItemButton, ListItemText } from '@mui/material';
import currency from 'currency.js';

export default async function AccountsList() {
  const accounts = await getAccounts();

  return (
    <List>
      {accounts.map((account) => (
        <ListItem key={account.accountId}>
          <ListItemText
            secondary={
              typeof account.Balance.current === 'number' &&
              currency(account.Balance.current).format()
            }
          >
            {account.name}
          </ListItemText>
          <ListItemButton>
            <SyncTransactionsButton itemId={account.itemId} />
          </ListItemButton>
        </ListItem>
      ))}
    </List>
  );
}
