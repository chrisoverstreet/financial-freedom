/** @type {import('next').NextConfig} */
const nextConfig = {
  redirects: async () => {
    return [
      {
        source: '/',
        missing: [
          {
            type: 'cookie',
            key: 'stytch_session',
          },
        ],
        permanent: false,
        destination: '/login',
      },
    ];
  },
};

module.exports = nextConfig;
