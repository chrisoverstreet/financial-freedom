'use client';

import { getDomainFromWindow } from '@/lib/urlUtils';
import { StytchLogin } from '@stytch/nextjs';
import {
  OAuthProviders,
  Products,
  StytchLoginConfig,
} from '@stytch/vanilla-js';

const styles = {
  container: {
    width: '100%',
  },
  buttons: {
    primary: {
      backgroundColor: '#4A37BE',
      borderColor: '#4A37BE',
    },
  },
};

export default function Login() {
  const REDIRECT_URL = getDomainFromWindow() + '/authenticate';

  const config = {
    products: [Products.emailMagicLinks, Products.oauth],
    emailMagicLinksOptions: {
      loginRedirectURL: REDIRECT_URL,
      loginExpirationMinutes: 60,
      signupRedirectURL: REDIRECT_URL,
      signupExpirationMinutes: 60,
    },
    oauthOptions: {
      providers: [{ type: OAuthProviders.Google }],
      loginRedirectURL: REDIRECT_URL,
      signupRedirectURL: REDIRECT_URL,
    },
  } satisfies StytchLoginConfig;

  return <StytchLogin config={config} styles={styles} />;
}
