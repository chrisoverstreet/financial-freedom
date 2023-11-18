'use client';

import NextAppDirEmotionCacheProvider from '@/components/ThemeRegistry/EmotionCache';
import theme from '@/components/ThemeRegistry/theme';
import { CssBaseline } from '@mui/material';
import { ThemeProvider } from '@mui/material/styles';
import type { ReactNode } from 'react';

type Props = {
  children: ReactNode;
};

export default function ThemeRegistry({ children }: Props) {
  return (
    <NextAppDirEmotionCacheProvider options={{ key: 'mui' }}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        {children}
      </ThemeProvider>
    </NextAppDirEmotionCacheProvider>
  );
}
