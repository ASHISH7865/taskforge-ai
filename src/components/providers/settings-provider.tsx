'use client'

import * as React from 'react'
import { useEffect } from 'react'
import { useSelector } from 'react-redux'
import {
  selectAnimationsEnabled,
  selectAnimationSpeed,
  selectFontSize,
  selectUIDensity
} from '@/lib/features/settings/settings-selectors'

export function SettingsProvider({
  children,
}: {
  children: React.ReactNode
}) {
  const animationsEnabled = useSelector(selectAnimationsEnabled)
  const animationSpeed = useSelector(selectAnimationSpeed)
  const fontSize = useSelector(selectFontSize)
  const uiDensity = useSelector(selectUIDensity)

  // Apply settings when component mounts and when settings change
  useEffect(() => {
    // Set CSS variables for animation speed
    document.documentElement.style.setProperty('--app-animation-speed', String(animationSpeed))

    // Set CSS variables for font size
    document.documentElement.style.setProperty('--app-font-size', `${fontSize}px`)

    // Apply UI density classes
    document.body.classList.remove('ui-compact', 'ui-default', 'ui-comfortable')
    document.body.classList.add(`ui-${uiDensity}`)

    // Apply animations enabled/disabled
    if (!animationsEnabled) {
      document.body.classList.add('reduce-animations')
    } else {
      document.body.classList.remove('reduce-animations')
    }

    // Apply base font size
    document.body.style.fontSize = `${fontSize}px`

    // Apply transition speeds based on animation speed
    const transitionSpeed = animationsEnabled ? `${0.2 / animationSpeed}s` : '0s'
    document.documentElement.style.setProperty('--transition-speed', transitionSpeed)

  }, [animationsEnabled, animationSpeed, fontSize, uiDensity])

  return <>{children}</>
}
