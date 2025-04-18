'use client'

import * as React from 'react'
import { useEffect } from 'react'
import { useSelector } from 'react-redux'
import { selectThemeMode } from '@/lib/features/settings/settings-selectors'

export function ThemeProvider({
  children,
}: {
  children: React.ReactNode
}) {
  const themeMode = useSelector(selectThemeMode)

  // Apply theme when component mounts and when theme changes
  useEffect(() => {
    // Set theme on document element
    document.documentElement.setAttribute('data-theme', themeMode)

    // Toggle dark mode class
    if (themeMode === 'dark' ||
        (themeMode === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }

    // Set up listener for system theme changes if using system theme
    if (themeMode === 'system') {
      const systemThemeChangeHandler = (e: MediaQueryListEvent) => {
        if (e.matches) {
          document.documentElement.classList.add('dark')
        } else {
          document.documentElement.classList.remove('dark')
        }
      }

      const systemThemeMediaQuery = window.matchMedia('(prefers-color-scheme: dark)')
      systemThemeMediaQuery.addEventListener('change', systemThemeChangeHandler)

      return () => {
        systemThemeMediaQuery.removeEventListener('change', systemThemeChangeHandler)
      }
    }
  }, [themeMode])

  return <>{children}</>
}
