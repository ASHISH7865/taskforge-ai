import { RootState } from '@/lib/store';

// Theme selectors
export const selectThemeMode = (state: RootState) => state.settings.theme.mode;
export const selectHighContrast = (state: RootState) => state.settings.theme.highContrast;

// Appearance selectors
export const selectUIDensity = (state: RootState) => state.settings.appearance.uiDensity;
export const selectFontSize = (state: RootState) => state.settings.appearance.fontSize;
export const selectAnimationsEnabled = (state: RootState) => state.settings.appearance.animationsEnabled;

// Performance selectors
export const selectHardwareAcceleration = (state: RootState) => state.settings.performance.hardwareAcceleration;
export const selectCacheStrategy = (state: RootState) => state.settings.performance.cacheStrategy;
export const selectAnimationSpeed = (state: RootState) => state.settings.performance.animationSpeed;

// Notification selectors
export const selectBrowserNotifications = (state: RootState) => state.settings.notifications.browser;
export const selectEmailNotifications = (state: RootState) => state.settings.notifications.email;
export const selectReminderNotifications = (state: RootState) => state.settings.notifications.reminders;
export const selectEmailAddress = (state: RootState) => state.settings.notifications.emailAddress;
export const selectNotificationTypes = (state: RootState) => state.settings.notifications.notificationTypes;
export const selectQuietHours = (state: RootState) => state.settings.notifications.quietHours;

// Developer selectors
export const selectDevMode = (state: RootState) => state.settings.developer.devMode;
export const selectApiEndpoint = (state: RootState) => state.settings.developer.apiEndpoint;
export const selectConsoleLogging = (state: RootState) => state.settings.developer.consoleLogging;

// Full section selectors
export const selectThemeSettings = (state: RootState) => state.settings.theme;
export const selectAppearanceSettings = (state: RootState) => state.settings.appearance;
export const selectPerformanceSettings = (state: RootState) => state.settings.performance;
export const selectNotificationSettings = (state: RootState) => state.settings.notifications;
export const selectDeveloperSettings = (state: RootState) => state.settings.developer;

// Full settings selector
export const selectAllSettings = (state: RootState) => state.settings;
