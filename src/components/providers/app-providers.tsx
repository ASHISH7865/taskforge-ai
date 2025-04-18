'use client'

import * as React from 'react'
import StoreProvider from './StoreProvider'
import { ThemeProvider } from './theme-provider'
import { SettingsProvider } from './settings-provider'
import { LocalStorageProvider } from './local-storage-provider'

export function AppProviders({
  children
}: {
  children: React.ReactNode
}) {
  return (
    <StoreProvider>
      <LocalStorageProvider />
      <ThemeProvider>
        <SettingsProvider>
          {children}
        </SettingsProvider>
      </ThemeProvider>
    </StoreProvider>
  )
}
