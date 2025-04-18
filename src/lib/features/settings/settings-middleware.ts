import { Middleware } from '@reduxjs/toolkit';
import { RootState } from '@/lib/store';
import { ThemeMode, UIDensity } from './settings-slice';

// Define the action type that includes a type property
interface SettingsAction {
  type: string;
  payload: unknown;
}

// Create a middleware to sync the settings with localStorage
export const settingsMiddleware: Middleware = store => next => action => {
  // Run the action first to update the state
  const result = next(action);

  // Check if it's a settings action - type-guard to narrow the type
  if (typeof (action as SettingsAction).type === 'string' &&
      (action as SettingsAction).type.startsWith('settings/')) {
    const settingsAction = action as SettingsAction;
    const state = store.getState() as RootState;
    const settingsState = state.settings;

    // Sync with localStorage
    if (typeof window !== 'undefined') {
      localStorage.setItem('app-settings', JSON.stringify(settingsState));

      // Sync theme with next-themes
      if (settingsAction.type === 'settings/setThemeMode') {
        const themeMode = settingsAction.payload as ThemeMode;
        document.documentElement.setAttribute('data-theme', themeMode);
      }

      // Apply UI density class to body
      if (settingsAction.type === 'settings/setUIDensity') {
        const uiDensity = settingsAction.payload as UIDensity;
        document.body.classList.remove('ui-compact', 'ui-default', 'ui-comfortable');
        document.body.classList.add(`ui-${uiDensity}`);
      }

      // Apply font size
      if (settingsAction.type === 'settings/setFontSize') {
        const fontSize = settingsAction.payload as number;
        document.documentElement.style.setProperty('--app-font-size', `${fontSize}px`);
      }

      // Apply animation speed
      if (settingsAction.type === 'settings/setAnimationSpeed') {
        const speed = settingsAction.payload as number;
        document.documentElement.style.setProperty('--app-animation-speed', String(speed));
      }

      // Apply animations enabled/disabled
      if (settingsAction.type === 'settings/setAnimationsEnabled') {
        const enabled = settingsAction.payload as boolean;
        if (!enabled) {
          document.body.classList.add('reduce-animations');
        } else {
          document.body.classList.remove('reduce-animations');
        }
      }

      // Apply high contrast
      if (settingsAction.type === 'settings/setHighContrast') {
        const enabled = settingsAction.payload as boolean;
        if (enabled) {
          document.body.classList.add('high-contrast');
        } else {
          document.body.classList.remove('high-contrast');
        }
      }

      // If loadSavedSettings action is dispatched, apply all settings at once
      if (settingsAction.type === 'settings/loadSavedSettings') {
        applySettingsToDOM(settingsState);
      }
    }
  }

  return result;
};

// Function to load settings from localStorage
export const loadSettingsFromLocalStorage = () => {
  if (typeof window === 'undefined') {
    return null;
  }

  try {
    const serializedSettings = localStorage.getItem('app-settings');
    if (serializedSettings === null) {
      return null;
    }
    return JSON.parse(serializedSettings);
  } catch (err) {
    console.error('Failed to load settings from localStorage:', err);
    return null;
  }
};

// Function to apply settings to the DOM
export const applySettingsToDOM = (settings: RootState['settings']) => {
  if (typeof window === 'undefined') {
    return;
  }

  // Apply theme
  document.documentElement.setAttribute('data-theme', settings.theme.mode);

  // Apply UI density
  document.body.classList.remove('ui-compact', 'ui-default', 'ui-comfortable');
  document.body.classList.add(`ui-${settings.appearance.uiDensity}`);

  // Apply font size
  document.documentElement.style.setProperty('--app-font-size', `${settings.appearance.fontSize}px`);

  // Apply animation speed
  document.documentElement.style.setProperty('--app-animation-speed', String(settings.performance.animationSpeed));

  // Apply animations enabled/disabled
  if (!settings.appearance.animationsEnabled) {
    document.body.classList.add('reduce-animations');
  } else {
    document.body.classList.remove('reduce-animations');
  }

  // Apply high contrast
  if (settings.theme.highContrast) {
    document.body.classList.add('high-contrast');
  } else {
    document.body.classList.remove('high-contrast');
  }
};
