'use server';

import getAccounts from '@/actions/get-accounts';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';

type Props = {
  account: Awaited<ReturnType<typeof getAccounts>>[number];
};

export default async function AccountListItem({ account }: Props) {
  return (
    <ListItem>
      <ListItemText>{account.name}</ListItemText>
    </ListItem>
  );
}
