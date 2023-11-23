'use server';

import getAccounts from '@/actions/get-accounts';
import { List, ListItem, ListItemText } from '@mui/material';
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
        </ListItem>
      ))}
    </List>
  );
}
