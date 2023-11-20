'use client';

import { deleteAccount } from '@/components/actions/delete-account';
import { getAccounts } from '@/components/actions/get-accounts';
import DeleteIcon from '@mui/icons-material/Delete';
import IconButton from '@mui/material/IconButton';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import currency from 'currency.js';

type Props = {
  account: Awaited<ReturnType<typeof getAccounts>>[0]['Accounts'][0];
  afterDelete: () => unknown;
};

export default function AccountCard({ account, afterDelete }: Props) {
  return (
    <ListItem
      secondaryAction={
        <IconButton onClick={onDeleteClick}>
          <DeleteIcon />
        </IconButton>
      }
    >
      <ListItemText>
        {account.name}
        {typeof account.availableBalance === 'number'
          ? ` - ${currency(account.availableBalance).format()}`
          : ''}
      </ListItemText>
    </ListItem>
  );

  async function onDeleteClick() {
    await deleteAccount(account.id);
    afterDelete();
  }
}
