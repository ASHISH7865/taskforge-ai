import { configureStore } from '@reduxjs/toolkit'
import settingsReducer from '@/lib/features/settings/settings-slice'
import todoReducer from '@/lib/features/todo/todo-slice'
import filterReducer from '@/lib/features/todo/filter-slice'
import { settingsMiddleware, loadSettingsFromLocalStorage } from '@/lib/features/settings/settings-middleware'
import { aiApi } from '@/lib/services/ai-api'

export const makeStore = () => {
  // Create the store with reducers and middleware
  const store = configureStore({
    reducer: {
      settings: settingsReducer,
      todos: todoReducer,
      filter: filterReducer,
      [aiApi.reducerPath]: aiApi.reducer,
    },
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware().concat(settingsMiddleware, aiApi.middleware),
  });

  // Load saved settings if available
  const savedSettings = loadSettingsFromLocalStorage();
  if (savedSettings) {
    store.dispatch({
      type: 'settings/loadSavedSettings',
      payload: savedSettings
    });
  }

  return store;
}

// Infer the type of makeStore
export type AppStore = ReturnType<typeof makeStore>
// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<AppStore['getState']>
export type AppDispatch = AppStore['dispatch']
