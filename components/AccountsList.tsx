'use server';

import getAccounts from '@/actions/get-accounts';
import AccountListItem from '@/components/AccountListItem';
import AddAccountButton from '@/components/AddAccountButton';
import Box from '@mui/material/Box';
import List from '@mui/material/List';
import Stack from '@mui/material/Stack';

export default async function AccountsList() {
  const accounts = await getAccounts();

  return (
    <Stack>
      <Box>
        <AddAccountButton />
      </Box>
      <List>
        {accounts.map((account) => (
          <AccountListItem account={account} key={account.accountId} />
        ))}
      </List>
    </Stack>
  );
}
