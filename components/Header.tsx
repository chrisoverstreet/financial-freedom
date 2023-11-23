'use server';

import AuthButton from '@/components/AuthButton';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';

export default async function Header() {
  return (
    <AppBar position='sticky'>
      <Toolbar>
        <Typography sx={{ flexGrow: 1 }}>Financial Freedom</Typography>
        <AuthButton />
      </Toolbar>
    </AppBar>
  );
}
