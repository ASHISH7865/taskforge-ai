import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export type ThemeMode = 'light' | 'dark' | 'system';
export type UIDensity = 'compact' | 'default' | 'comfortable';
export type CacheStrategy = 'performance' | 'balanced' | 'fresh';

export interface SettingsState {
  theme: {
    mode: ThemeMode;
    highContrast: boolean;
  };
  appearance: {
    uiDensity: UIDensity;
    fontSize: number;
    animationsEnabled: boolean;
  };
  performance: {
    hardwareAcceleration: boolean;
    cacheStrategy: CacheStrategy;
    animationSpeed: number;
  };
  notifications: {
    browser: boolean;
    email: boolean;
    reminders: boolean;
    emailAddress: string;
    notificationTypes: {
      tasks: boolean;
      comments: boolean;
      mentions: boolean;
      updates: boolean;
    };
    quietHours: {
      enabled: boolean;
      startTime: string;
      endTime: string;
    };
  };
  developer: {
    devMode: boolean;
    apiEndpoint: string;
    consoleLogging: boolean;
  };
}

const initialState: SettingsState = {
  theme: {
    mode: 'system',
    highContrast: false,
  },
  appearance: {
    uiDensity: 'default',
    fontSize: 16,
    animationsEnabled: true,
  },
  performance: {
    hardwareAcceleration: true,
    cacheStrategy: 'balanced',
    animationSpeed: 1.0,
  },
  notifications: {
    browser: true,
    email: true,
    reminders: true,
    emailAddress: 'user@example.com',
    notificationTypes: {
      tasks: true,
      comments: true,
      mentions: true,
      updates: false,
    },
    quietHours: {
      enabled: false,
      startTime: '22:00',
      endTime: '08:00',
    },
  },
  developer: {
    devMode: false,
    apiEndpoint: 'https://api.example.com',
    consoleLogging: false,
  },
};

export const settingsSlice = createSlice({
  name: 'settings',
  initialState,
  reducers: {
    // Load saved settings action
    loadSavedSettings: (state, action: PayloadAction<SettingsState>) => {
      return action.payload;
    },

    // Theme actions
    setThemeMode: (state, action: PayloadAction<ThemeMode>) => {
      state.theme.mode = action.payload;
    },
    setHighContrast: (state, action: PayloadAction<boolean>) => {
      state.theme.highContrast = action.payload;
    },

    // Appearance actions
    setUIDensity: (state, action: PayloadAction<UIDensity>) => {
      state.appearance.uiDensity = action.payload;
    },
    setFontSize: (state, action: PayloadAction<number>) => {
      state.appearance.fontSize = action.payload;
    },
    setAnimationsEnabled: (state, action: PayloadAction<boolean>) => {
      state.appearance.animationsEnabled = action.payload;
    },

    // Performance actions
    setHardwareAcceleration: (state, action: PayloadAction<boolean>) => {
      state.performance.hardwareAcceleration = action.payload;
    },
    setCacheStrategy: (state, action: PayloadAction<CacheStrategy>) => {
      state.performance.cacheStrategy = action.payload;
    },
    setAnimationSpeed: (state, action: PayloadAction<number>) => {
      state.performance.animationSpeed = action.payload;
    },

    // Notification actions
    setBrowserNotifications: (state, action: PayloadAction<boolean>) => {
      state.notifications.browser = action.payload;
    },
    setEmailNotifications: (state, action: PayloadAction<boolean>) => {
      state.notifications.email = action.payload;
    },
    setReminderNotifications: (state, action: PayloadAction<boolean>) => {
      state.notifications.reminders = action.payload;
    },
    setEmailAddress: (state, action: PayloadAction<string>) => {
      state.notifications.emailAddress = action.payload;
    },
    setNotificationType: (state, action: PayloadAction<{type: keyof SettingsState['notifications']['notificationTypes'], value: boolean}>) => {
      const { type, value } = action.payload;
      state.notifications.notificationTypes[type] = value;
    },
    setQuietHoursEnabled: (state, action: PayloadAction<boolean>) => {
      state.notifications.quietHours.enabled = action.payload;
    },
    setQuietHoursTimes: (state, action: PayloadAction<{startTime: string, endTime: string}>) => {
      const { startTime, endTime } = action.payload;
      state.notifications.quietHours.startTime = startTime;
      state.notifications.quietHours.endTime = endTime;
    },

    // Developer actions
    setDevMode: (state, action: PayloadAction<boolean>) => {
      state.developer.devMode = action.payload;
    },
    setApiEndpoint: (state, action: PayloadAction<string>) => {
      state.developer.apiEndpoint = action.payload;
    },
    setConsoleLogging: (state, action: PayloadAction<boolean>) => {
      state.developer.consoleLogging = action.payload;
    },

    // Reset actions
    resetAppearanceSettings: (state) => {
      state.appearance = initialState.appearance;
    },
    resetAllSettings: () => initialState,
  },
});

export const {
  // Load action
  loadSavedSettings,

  // Theme actions
  setThemeMode,
  setHighContrast,

  // Appearance actions
  setUIDensity,
  setFontSize,
  setAnimationsEnabled,

  // Performance actions
  setHardwareAcceleration,
  setCacheStrategy,
  setAnimationSpeed,

  // Notification actions
  setBrowserNotifications,
  setEmailNotifications,
  setReminderNotifications,
  setEmailAddress,
  setNotificationType,
  setQuietHoursEnabled,
  setQuietHoursTimes,

  // Developer actions
  setDevMode,
  setApiEndpoint,
  setConsoleLogging,

  // Reset actions
  resetAppearanceSettings,
  resetAllSettings,
} = settingsSlice.actions;

export default settingsSlice.reducer;
