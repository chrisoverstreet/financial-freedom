'use client';

import getPlaidLinkToken from '@/actions/get-plaid-link-token';
import { handlePlaidLinkSuccess } from '@/actions/handle-plaid-link-success';
import Button from '@mui/material/Button';
import { useCallback, useEffect, useState } from 'react';
import { PlaidLinkOnSuccess, usePlaidLink } from 'react-plaid-link';

export default function AddAccountButton() {
  const [linkToken, setLinkToken] = useState<string | null>(null);

  const onSuccess = useCallback<PlaidLinkOnSuccess>(async (publicToken) => {
    await handlePlaidLinkSuccess(publicToken);
  }, []);

  const { open, ready } = usePlaidLink({ token: linkToken, onSuccess });

  useEffect(() => {
    if (ready) {
      open();
    }
  }, [open, ready]);

  return <Button onClick={onClick}>Add Account</Button>;

  function onClick() {
    if (!linkToken) {
      getPlaidLinkToken().then(setLinkToken);
    } else {
      open();
    }
  }
}
