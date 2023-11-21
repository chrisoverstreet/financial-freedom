'use client';

import { plaidLinkOnSuccess } from '@/components/actions/plaid-link-on-success';
import AddIcon from '@mui/icons-material/Add';
import Button from '@mui/material/Button';
import { useStytchUser } from '@stytch/nextjs';
import { useCallback, useEffect } from 'react';
import { PlaidLinkOnSuccess, usePlaidLink } from 'react-plaid-link';

type Props = {
  linkToken?: string;
  onSuccess?: () => unknown;
};

export default function Link({
  linkToken,
  onSuccess: onSuccessCallback,
}: Props) {
  const { user } = useStytchUser();

  const onSuccess = useCallback<PlaidLinkOnSuccess>(
    async (public_token, metadata) => {
      await plaidLinkOnSuccess(public_token, metadata);
      await onSuccessCallback?.();
    },
    [onSuccessCallback],
  );

  let isOauth = false;
  const config: Parameters<typeof usePlaidLink>[0] = {
    token: linkToken ?? '',
    onSuccess,
  };

  if (
    typeof window !== 'undefined' &&
    window.location.href.includes('?oauth_state_id=')
  ) {
    config.receivedRedirectUri = window.location.href;
    isOauth = true;
  }

  const { open, ready } = usePlaidLink(config);

  useEffect(() => {
    if (isOauth && ready) {
      open();
    }
  }, [isOauth, open, ready]);

  return (
    <Button disabled={!linkToken} onClick={() => open()} variant='contained'>
      <AddIcon sx={{ mr: 1 }} />
      Add Account
    </Button>
  );
}
