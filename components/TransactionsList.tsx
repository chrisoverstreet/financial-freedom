'use server';

import getTransactions from '@/actions/get-transactions';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import currency from 'currency.js';

export default async function TransactionsList() {
  const transactions = await getTransactions();

  return (
    <List>
      {transactions.map((transaction) => (
        <ListItem key={transaction.transactionId}>
          <ListItemText secondary={transaction.datetime?.toISOString()}>
            {transaction.name}
          </ListItemText>
          <ListItemText>{currency(transaction.amount).format()}</ListItemText>
        </ListItem>
      ))}
    </List>
  );
}
