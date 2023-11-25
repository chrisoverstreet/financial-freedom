'use server';

import AccountsList from '@/components/AccountsList';
import AddAccountButton from '@/components/AddAccountButton';
import AssetsAndLiabilitiesCard from '@/components/AssetsAndLiabilitiesCard';
import NetWorthCard from '@/components/NetWorthCard';
import SpentThisMonthCard from '@/components/SpentThisMonthCard';
import { authOptions } from '@/lib/next-auth';
import Container from '@mui/material/Container';
import Divider from '@mui/material/Divider';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import { getServerSession } from 'next-auth';
import { redirect } from 'next/navigation';

export default async function HomePage() {
  const session = await getServerSession(authOptions);

  if (!session?.user) {
    return redirect('/welcome');
  }

  return (
    <Container sx={{ py: 4 }}>
      <Grid container columns={4} columnSpacing={2}>
        <Grid xs={1}>
          <NetWorthCard sx={{ height: '100%' }} />
        </Grid>
        <Grid xs={2}>
          <AssetsAndLiabilitiesCard sx={{ height: '100%' }} />
        </Grid>
        <Grid xs={1}>
          <SpentThisMonthCard sx={{ height: '100%' }} />
        </Grid>
      </Grid>
      <Divider />
      <Typography variant='h4'>Accounts</Typography>
      <AccountsList />
      <AddAccountButton />
    </Container>
  );
}
