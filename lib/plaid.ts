import { Configuration, PlaidApi, PlaidEnvironments } from 'plaid';

declare namespace global {
  let plaid: PlaidApi | undefined;
}

let plaid: PlaidApi;

const configuration = new Configuration({
  basePath: PlaidEnvironments.sandbox,
  baseOptions: {
    headers: {
      'PLAID-CLIENT-ID': process.env.PLAID_CLIENT_ID,
      'PLAID-SECRET': process.env.PLAID_SECRET,
    },
  },
});

if (process.env.NODE_ENV === 'production') {
  plaid = new PlaidApi(configuration);
} else {
  if (!global.plaid) {
    global.plaid = new PlaidApi(configuration);
  }
  plaid = global.plaid;
}

export default plaid;
