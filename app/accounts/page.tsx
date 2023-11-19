'use client';

import Link from '@/components/Link';
import * as actions from '@/components/actions/plaid-actions';
import {
  createLinkToken,
  createLinkTokenForPayment,
  getAccounts,
} from '@/components/actions/plaid-actions';
import PlaidContext from '@/contexts/PlaidContext';
import { Stack } from '@mui/material';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import { useStytchUser } from '@stytch/nextjs';
import { Products } from 'plaid';
import { useCallback, useContext, useEffect, useState } from 'react';

export default function AccountsPage() {
  const [accounts, setAccounts] = useState<JSON>();

  const { isInitialized, user } = useStytchUser();

  const {
    accessToken,
    linkSuccess,
    isItemAccess,
    isPaymentInitiation,
    dispatch,
  } = useContext(PlaidContext);

  console.log({
    linkSuccess,
    isItemAccess,
    isPaymentInitiation,
  });

  const getInfo = useCallback(async () => {
    try {
      const { products } = await actions.getInfo();
      const paymentInitiation = products.includes(Products.PaymentInitiation);
      dispatch({
        type: 'SET_STATE',
        state: {
          products,
          isPaymentInitiation: paymentInitiation,
        },
      });
      return { paymentInitiation };
    } catch (e) {
      dispatch({ type: 'SET_STATE', state: { backend: false } });
      return { paymentInitiation: false };
    }
  }, [dispatch]);

  const generateToken = useCallback(
    async (isPaymentInitiation: boolean, userId: string) => {
      try {
        const data = isPaymentInitiation
          ? await createLinkTokenForPayment(userId)
          : await createLinkToken(userId);

        console.log({ data });

        if (data) {
          if (data.error != null) {
            dispatch({
              type: 'SET_STATE',
              state: {
                linkToken: null,
                linkTokenError: data.error,
              },
            });
            return;
          }
          dispatch({
            type: 'SET_STATE',
            state: { linkToken: data.link_token },
          });
        }
        localStorage.setItem('link_token', data.link_token);
      } catch (e) {
        dispatch({
          type: 'SET_STATE',
          state: { linkToken: null },
        });
      }
    },
    [dispatch],
  );

  useEffect(() => {
    if (isInitialized && !!user) {
      const init = async () => {
        const { paymentInitiation } = await getInfo();

        if (window.location.href.includes('?oauth_state_id=')) {
          dispatch({
            type: 'SET_STATE',
            state: {
              linkToken: localStorage.getItem('link_token'),
            },
          });
          return;
        }

        generateToken(paymentInitiation, user.user_id);
      };
      init();
    }
  }, [dispatch, generateToken, getInfo, isInitialized, user]);

  useEffect(() => {
    if (accessToken) {
      getAccounts().then(setAccounts).catch(console.error);
    }
  }, [accessToken]);

  return (
    <Stack gap={2}>
      <Typography variant='h2'>Accounts Page</Typography>
      <Box>
        <Link />
      </Box>
      {accounts && <pre>{JSON.stringify(accounts, null, `\t`)}</pre>}
    </Stack>
  );
}
