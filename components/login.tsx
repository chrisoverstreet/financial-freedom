import { StytchLogin } from '@stytch/nextjs';
import {
  OAuthProviders,
  Products,
  StytchLoginConfig,
} from '@stytch/vanilla-js';

const REDIRECT_URL = 'http://localhost:3000/authenticate';

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

export default function Login() {
  return <StytchLogin config={config} styles={styles} />;
}
