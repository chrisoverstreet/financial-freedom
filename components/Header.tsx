import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';

export default function Header() {
  return (
    <AppBar position='sticky'>
      <Toolbar>
        <Typography variant='h6'>Financial Freedom</Typography>
      </Toolbar>
    </AppBar>
  );
}
