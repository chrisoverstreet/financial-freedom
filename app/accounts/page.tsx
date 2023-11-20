'use client';

import AccountCard from '@/components/AccountCard';
import Link from '@/components/Link';
import { getAccounts } from '@/components/actions/get-accounts';
import getLinkToken from '@/components/actions/get-link-token';
import { Collapse, List } from '@mui/material';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { useStytchUser } from '@stytch/nextjs';
import { useRouter } from 'next/navigation';
import { useCallback, useEffect, useState } from 'react';
import { TransitionGroup } from 'react-transition-group';

export default function AccountsPage() {
  const [accounts, setAccounts] = useState<
    Awaited<ReturnType<typeof getAccounts>>[0]['Accounts']
  >([]);

  const router = useRouter();

  const { user } = useStytchUser();

  const [linkToken, setLinkToken] = useState<string>();

  const getLatestAccounts = useCallback(
    async () =>
      getAccounts().then((items) => {
        setAccounts(items.flatMap((item) => item.Accounts));
      }),
    [],
  );

  useEffect(() => {
    if (user && !linkToken) {
      getLinkToken().then((lt) => setLinkToken(lt ?? undefined));
    }
  }, [linkToken, user]);

  useEffect(() => {
    getLatestAccounts();
  }, [getLatestAccounts, router]);

  return (
    <Stack gap={2}>
      <Typography variant='h2'>Accounts Page</Typography>
      <Box>
        <Link linkToken={linkToken} onSuccess={getLatestAccounts} />
      </Box>
      <List>
        {!!accounts.length && (
          <TransitionGroup enter>
            {accounts.map((account) => (
              <Collapse key={account.id} mountOnEnter>
                <AccountCard
                  account={account}
                  afterDelete={getLatestAccounts}
                />
              </Collapse>
            ))}
          </TransitionGroup>
        )}
      </List>
    </Stack>
  );
}
