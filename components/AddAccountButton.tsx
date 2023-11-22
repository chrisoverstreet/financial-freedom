'use client';

import getPlaidLinkToken from '@/actions/get-plaid-link-token';
import { handlePlaidLinkSuccess } from '@/actions/handle-plaid-link-success';
import Button from '@mui/material/Button';
import { useCallback, useEffect, useState } from 'react';
import {
  PlaidLinkOnEvent,
  PlaidLinkOnExit,
  PlaidLinkOnSuccess,
  usePlaidLink,
} from 'react-plaid-link';

export default function AddAccountButton() {
  const [linkToken, setLinkToken] = useState<string | null>(null);

  const onEvent = useCallback<PlaidLinkOnEvent>((eventName) => {}, []);

  const onExit = useCallback<PlaidLinkOnExit>(() => {}, []);

  const onSuccess = useCallback<PlaidLinkOnSuccess>((publicToken) => {
    handlePlaidLinkSuccess(publicToken);
  }, []);

  useEffect(() => {
    getPlaidLinkToken().then(setLinkToken);
  }, []);

  const { open, exit, ready } = usePlaidLink({
    token: linkToken,
    onSuccess,
    onExit,
    onEvent,
  });

  return (
    <Button disabled={!ready} onClick={onClick}>
      Add Account
    </Button>
  );

  async function onClick() {
    if (ready) {
      open();
    }
  }
}
