import '@/styles/globals.css'

import type { AppProps } from 'next/app'

import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'
import React, { useState, useEffect, ReactElement } from "react";

export default function App({ Component, pageProps }: AppProps) {

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <Component {...pageProps} />;
    </LocalizationProvider>
  )
}
