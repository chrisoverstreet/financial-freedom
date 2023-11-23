'use client';

import getPlaidLinkToken from '@/actions/get-plaid-link-token';
import { handlePlaidLinkSuccess } from '@/actions/handle-plaid-link-success';
import Button from '@mui/material/Button';
import { useCallback, useEffect, useState } from 'react';
import { PlaidLinkOnSuccess, usePlaidLink } from 'react-plaid-link';

export default function AddAccountButton() {
  const [linkToken, setLinkToken] = useState<string | null>(null);

  const onSuccess = useCallback<PlaidLinkOnSuccess>(async (publicToken) => {
    handlePlaidLinkSuccess(publicToken).then(console.log).catch(console.error);
  }, []);

  const { open, ready } = usePlaidLink({ token: linkToken, onSuccess });

  useEffect(() => {
    if (ready) {
      open();
    }
  }, [open, ready]);

  return <Button onClick={onClick}>Add Account</Button>;

  function onClick() {
    getPlaidLinkToken().then((token) => {
      console.log(token);
      setLinkToken(token);
    });
  }
}
