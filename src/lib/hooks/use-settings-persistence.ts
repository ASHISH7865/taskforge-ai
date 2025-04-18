import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { selectAllSettings } from '@/lib/features/settings/settings-selectors'
import { loadSavedSettings } from '@/lib/features/settings/settings-slice'

export function useSettingsPersistence() {
  const dispatch = useDispatch()
  const settings = useSelector(selectAllSettings)

  // Load settings from localStorage on mount
  useEffect(() => {
    try {
      const savedSettings = localStorage.getItem('app-settings')
      if (savedSettings) {
        dispatch(loadSavedSettings(JSON.parse(savedSettings)))
      }
    } catch (error) {
      console.error('Failed to load settings from localStorage:', error)
    }
  }, [dispatch])

  // Save settings to localStorage when they change
  useEffect(() => {
    try {
      localStorage.setItem('app-settings', JSON.stringify(settings))
    } catch (error) {
      console.error('Failed to save settings to localStorage:', error)
    }
  }, [settings])
}
