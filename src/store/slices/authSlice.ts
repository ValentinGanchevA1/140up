// src/store/slices/authSlice.ts
import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import {
  AuthState,
  AuthUser,
  RegisterRequest,
  RegisterResponse,
  LoginResponse,
  LoginRequest, // Assuming this will be added to api.ts
} from '@/types';
import * as authAPI from '@/services/authAPI'; // Assuming an authAPI service
import { normalizeError, AppError } from '@/utils/errorHandler';

// =================================================================
// Thunks for Asynchronous Actions
// =================================================================

/**
 * Handles user registration.
 * NOTE: The SignupScreen currently only sends email/password. It must be updated
 * to collect and send the full RegisterRequest object.
 */
export const registerUser = createAsyncThunk<
  // Type of the return value on success
  RegisterResponse['data'],
  // Type of the first argument to the thunk
  RegisterRequest,
  // Types for thunkAPI
  { rejectValue: AppError }
>('auth/register', async (credentials, { rejectWithValue }) => {
  try {
    const response = await authAPI.register(credentials);
    return response.data;
  } catch (error) {
    // Normalize the error to a consistent shape before rejecting
    return rejectWithValue(normalizeError(error, 'Registration failed.'));
  }
});

/**
 * Handles user login.
 */
export const loginUser = createAsyncThunk<
  LoginResponse['data'],
  LoginRequest,
  { rejectValue: AppError }
>('auth/login', async (credentials, { rejectWithValue }) => {
  try {
    // Assuming a login API endpoint exists
    const response = await authAPI.login(credentials);
    return response.data;
  } catch (error) {
    return rejectWithValue(normalizeError(error, 'Login failed. Please check your credentials.'));
  }
});


// =================================================================
// Initial State
// =================================================================

const initialState: AuthState = {
  user: null,
  isAuthenticated: false,
  token: null,
  refreshToken: null,
  tokenExpiry: null,
  isLoading: false,
  error: null,
};

// =================================================================
// Auth Slice Definition
// =================================================================

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    /**
     * Sets user credentials in the state. A reusable reducer for login/register success.
     */
    setCredentials(state, action: PayloadAction<RegisterResponse['data'] | LoginResponse['data']>) {
      const { user, token } = action.payload;
      state.user = user as AuthUser; // Cast User to AuthUser
      state.token = token;
      state.isAuthenticated = true;
      state.error = null;
      state.isLoading = false;
    },
    /**
     * Clears user session data from the state upon logout.
     */
    logout(state) {
      state.user = null;
      state.isAuthenticated = false;
      state.token = null;
      state.refreshToken = null;
      state.tokenExpiry = null;
      state.error = null;
    },
    /**
     * Clears any existing authentication errors from the state.
     */
    clearError(state) {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    // Handle pending and rejected states for all auth thunks
    builder
      .addMatcher(
        // Matcher for when any of our auth thunks are pending
        (action) => action.type.startsWith('auth/') && action.type.endsWith('/pending'),
        (state) => {
          state.isLoading = true;
          state.error = null;
        }
      )
      .addMatcher(
        // Matcher for when any of our auth thunks are rejected
        (action) => action.type.startsWith('auth/') && action.type.endsWith('/rejected'),
        (state, action: PayloadAction<AppError>) => {
          state.isLoading = false;
          state.error = action.payload;
        }
      );

    // Handle fulfilled states specifically
    builder.addCase(registerUser.fulfilled, (state, action) => {
      // Use the reusable setCredentials reducer
      authSlice.caseReducers.setCredentials(state, action);
    });

    builder.addCase(loginUser.fulfilled, (state, action) => {
      authSlice.caseReducers.setCredentials(state, action);
    });
  },
});

export const { setCredentials, logout, clearError } = authSlice.actions;
export default authSlice.reducer;
