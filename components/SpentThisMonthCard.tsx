'use server';

import { authOptions } from '@/lib/next-auth';
import prisma from '@/lib/prisma';
import Card, { CardProps } from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import currency from 'currency.js';
import { startOfMonth } from 'date-fns';
import format from 'date-fns/format';
import { getServerSession } from 'next-auth';

type Props = {
  sx?: CardProps['sx'];
};

export default async function SpentThisMonthCard({ sx }: Props) {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    return null;
  }

  console.log(format(startOfMonth(new Date()), 'yyyy-MM-dd'));

  const spentThisMonth = await prisma.plaidTransaction
    .aggregate({
      _sum: {
        amount: true,
      },
      where: {
        Account: {
          Item: {
            userId: session.user.id,
          },
        },
        date: {
          gte: format(startOfMonth(new Date()), 'yyyy-MM-dd'),
        },
      },
    })
    .then((record) => currency(record._sum.amount ?? 0));

  return (
    <Card sx={{ px: 3, py: 2, ...sx }}>
      <Stack gap={1}>
        <Typography color='primary' variant='h6'>
          Spent this month
        </Typography>
        <Typography color='text.primary' variant='h4'>
          {spentThisMonth.format()}
        </Typography>
      </Stack>
    </Card>
  );
}
