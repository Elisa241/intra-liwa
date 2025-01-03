// store.ts (or store.js)
import { configureStore } from '@reduxjs/toolkit';
import authReducer from './authSlice';

const store = configureStore({
  reducer: {
    auth: authReducer,
  },
});

type RootState = ReturnType<typeof store.getState>;
export default RootState; // Default export for RootState

export type AppDispatch = typeof store.dispatch;

export { store };
