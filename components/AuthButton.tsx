'use client';

import { Divider, Grow } from '@mui/material';
import Avatar from '@mui/material/Avatar';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import Tooltip from '@mui/material/Tooltip';
import Typography from '@mui/material/Typography';
import { signIn, signOut, useSession } from 'next-auth/react';
import Link from 'next/link';
import { useState } from 'react';

export default function AuthButton() {
  const { data: session, status } = useSession();

  const [anchorElUser, setAnchorElUser] = useState<HTMLElement | null>(null);

  if (status === 'loading') {
    return null;
  }

  if (session) {
    return (
      <Grow in>
        <Box sx={{ flexGrow: 0 }}>
          <Tooltip title='Open settings'>
            <IconButton onClick={(e) => setAnchorElUser(e.currentTarget)}>
              <Avatar
                alt={session.user?.name ?? ''}
                imgProps={{
                  referrerPolicy: 'no-referrer',
                }}
                src={session.user?.image ?? undefined}
              />
            </IconButton>
          </Tooltip>
          <Menu
            anchorEl={anchorElUser}
            anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
            id='menu-appbar'
            keepMounted
            onClose={() => setAnchorElUser(null)}
            open={!!anchorElUser}
            sx={{ mt: '45px' }}
            transformOrigin={{ vertical: 'top', horizontal: 'right' }}
          >
            <Link href='/' style={{ color: 'inherit', textDecoration: 'none' }}>
              <MenuItem onClick={() => setAnchorElUser(null)}>
                <Typography>Home</Typography>
              </MenuItem>
            </Link>
            <Link
              href='/transactions'
              style={{ color: 'inherit', textDecoration: 'none' }}
            >
              <MenuItem onClick={() => setAnchorElUser(null)}>
                <Typography>Transactions</Typography>
              </MenuItem>
            </Link>
            <Divider />
            <MenuItem
              onClick={() => {
                signOut();
                setAnchorElUser(null);
              }}
            >
              <Typography>Sign out</Typography>
            </MenuItem>
          </Menu>
        </Box>
      </Grow>
    );
  }

  return (
    <Button
      color='inherit'
      onClick={() => signIn('google', { callbackUrl: '/' })}
    >
      Sign in
    </Button>
  );
}
