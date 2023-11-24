'use server';

import getAccounts from '@/actions/get-accounts';
import { SyncTransactionsListItemButton } from '@/components/SyncTransactionsListItemButton';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import currency from 'currency.js';
import format from 'date-fns/format';

export default async function AccountsList() {
  const accounts = await getAccounts();

  return (
    <List>
      {accounts.map((account) => (
        <ListItem
          key={account.accountId}
          secondaryAction={
            <SyncTransactionsListItemButton itemId={account.itemId} />
          }
        >
          <ListItemText
            secondary={`Last update: ${
              account.Item.transactionsLastSyncAt
                ? format(
                    account.Item.transactionsLastSyncAt,
                    'MMM d yyyy, h:mm a',
                  )
                : '–'
            }`}
          >
            {account.name}
            {typeof account.Balance.current === 'number' &&
              ` - ${currency(account.Balance.current).format()}`}
          </ListItemText>
        </ListItem>
      ))}
    </List>
  );
}
