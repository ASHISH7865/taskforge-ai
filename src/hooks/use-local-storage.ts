'use client'

import { useState, useEffect } from 'react'

export function useLocalStorage<T>(
  key: string,
  initialValue: T
): [T, (value: T | ((val: T) => T)) => void] {
  // State to store our value
  // Pass initial state function to useState so logic is only executed once
  const [storedValue, setStoredValue] = useState<T>(initialValue)

  // Read from localStorage on mount
  useEffect(() => {
    // First check if localStorage is available to avoid errors
    if (typeof window === 'undefined') {
      return
    }

    try {
      // Get from local storage by key
      const item = window.localStorage.getItem(key)
      // Parse stored json or if none, use initialValue
      if (item) {
        setStoredValue(parseJSON(item))
      }
    } catch (error) {
      // If error, just use the initialValue
      console.warn(`Error reading localStorage key "${key}":`, error)
    }
  }, [key, initialValue])

  // Return a wrapped version of useState's setter function that
  // persists the new value to localStorage.
  const setValue = (value: T | ((val: T) => T)) => {
    try {
      // Allow value to be a function so we have same API as useState
      const valueToStore =
        value instanceof Function ? value(storedValue) : value
      // Save state
      setStoredValue(valueToStore)
      // Save to local storage
      if (typeof window !== 'undefined') {
        window.localStorage.setItem(key, JSON.stringify(valueToStore))
      }
    } catch (error) {
      // A more advanced implementation would handle the error case
      console.warn(`Error setting localStorage key "${key}":`, error)
    }
  }

  return [storedValue, setValue]
}

// Helper function to parse JSON with error handling
function parseJSON<T>(value: string): T {
  try {
    return JSON.parse(value)
  } catch {
    // If the value isn't valid JSON, return null
    return null as unknown as T
  }
}
