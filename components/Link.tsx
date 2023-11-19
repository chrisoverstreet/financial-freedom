'use client';

import * as actions from '@/components/actions/plaid-actions';
import PlaidContext from '@/contexts/PlaidContext';
import Button from '@mui/material/Button';
import { useCallback, useContext, useEffect } from 'react';
import { PlaidLinkOnSuccess, usePlaidLink } from 'react-plaid-link';

export default function Link() {
  const { linkToken, isPaymentInitiation, dispatch } = useContext(PlaidContext);

  console.log({ linkToken, isPaymentInitiation });

  const onSuccess = useCallback<PlaidLinkOnSuccess>(
    (public_token) => {
      const exchangePublicTokenForAccessToken = async () => {
        try {
          const { access_token: accessToken, item_id: itemId } =
            await actions.setAccessToken(public_token);

          dispatch({
            type: 'SET_STATE',
            state: {
              itemId,
              accessToken,
              isItemAccess: true,
            },
          });
        } catch (e) {
          dispatch({
            type: 'SET_STATE',
            state: {
              itemId: 'no item_id retrieved',
              accessToken: 'no access_token retrieved',
              isItemAccess: false,
            },
          });
        }
      };

      if (isPaymentInitiation) {
        dispatch({ type: 'SET_STATE', state: { isItemAccess: false } });
      } else {
        exchangePublicTokenForAccessToken();
      }
    },
    [dispatch, isPaymentInitiation],
  );

  let isOauth = false;
  const config: Parameters<typeof usePlaidLink>[0] = {
    token: linkToken!,
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
    <Button onClick={() => open()} variant='contained'>
      Launch Link
    </Button>
  );
}
