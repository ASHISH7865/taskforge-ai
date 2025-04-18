'use client'

import { useEffect } from 'react'
import { useSelector } from 'react-redux'
import { RootState } from '@/lib/store'
import { applySettingsToDOM } from '@/lib/features/settings/settings-middleware'

// This component applies settings to the DOM when the app loads
// It's a client-side only component that should be mounted once
export default function SettingsInitializer() {
  const settings = useSelector((state: RootState) => state.settings)

  useEffect(() => {
    // Apply all settings to DOM elements when mounted
    applySettingsToDOM(settings)
  }, [settings])

  // This component doesn't render anything
  return null
}
