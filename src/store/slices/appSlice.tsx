import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface AppState {
  isInitialized: boolean;
  isOnline: boolean;
  lastInitialized: string | null;
}

const initialState: AppState = {
  isInitialized: false,
  isOnline: true,
  lastInitialized: null,
};

const appSlice = createSlice({
  name: 'app',
  initialState,
  reducers: {
    // Action to mark app initialization complete
    initApp: (state) => {
      state.isInitialized = true;
      state.lastInitialized = new Date().toISOString();
    },

    // Action to set network status
    setNetworkStatus: (state, action: PayloadAction<boolean>) => {
      state.isOnline = action.payload;
    },

    // Action to reset initialization (for testing)
    resetInitialization: (state) => {
      state.isInitialized = false;
      state.lastInitialized = null;
    },
  },
});

export const { initApp, setNetworkStatus, resetInitialization } = appSlice.actions;
export default appSlice.reducer;
