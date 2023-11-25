'use server';

import getTotalAssets from '@/actions/get-total-assets';
import getTotalLiabilities from '@/actions/get-total-liabilities';
import { authOptions } from '@/lib/next-auth';
import Card, { CardProps } from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import currency from 'currency.js';
import { getServerSession } from 'next-auth';

type Props = {
  sx?: CardProps['sx'];
};

export default async function NetWorthCard({ sx }: Props) {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    return null;
  }

  const [assetsTotal, liabilitiesTotal] = await Promise.all([
    getTotalAssets(),
    getTotalLiabilities(),
  ]);

  const netWorth = currency(assetsTotal).subtract(liabilitiesTotal);

  return (
    <Card sx={{ px: 3, py: 2, ...sx }}>
      <Stack gap={2}>
        <Typography color='primary' variant='h6'>
          Net Worth
        </Typography>
        <Typography color='text.primary' variant='h4'>
          {netWorth.format()}
        </Typography>
        <Typography></Typography>
      </Stack>
    </Card>
  );
}
