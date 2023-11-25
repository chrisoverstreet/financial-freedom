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

export default async function AssetsAndLiabilitiesCard({ sx }: Props) {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    return null;
  }

  const [assetsTotal, liabilitiesTotal] = await Promise.all([
    getTotalAssets(),
    getTotalLiabilities(),
  ]);

  return (
    <Card sx={{ px: 3, py: 2, ...sx }}>
      <Stack direction='row' gap={2}>
        <Stack gap={1} sx={{ flex: 1 }}>
          <Typography color='primary' variant='h6'>
            Assets
          </Typography>
          <Typography color='text.primary' variant='h4'>
            {currency(assetsTotal).format()}
          </Typography>
        </Stack>
        <Stack gap={1} sx={{ flex: 1 }}>
          <Typography color='primary' variant='h6'>
            Liabilities
          </Typography>
          <Typography color='text.primary' variant='h4'>
            {currency(liabilitiesTotal).format()}
          </Typography>
        </Stack>
      </Stack>
    </Card>
  );
}
