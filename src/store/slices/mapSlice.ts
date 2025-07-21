import { createSlice, PayloadAction, createAsyncThunk } from '@reduxjs/toolkit';
import apiClient from '@/services/apiClient';
import { User, UserLocation, AppError, Region, SearchUsersRequest } from '@/types';

interface MapState {
  nearbyUsers: User[];
  userLocation: UserLocation | null;
  selectedUser: User | null;
  region: {
    latitude: number;
    longitude: number;
    latitudeDelta: number;
    longitudeDelta: number;
  } | null;
  isLoading: boolean;
  isLocationLoading: boolean;
  error: AppError | null;
  lastLocationUpdate: Date | null;
  locationPermissionStatus: 'granted' | 'denied' | 'pending' | null;
}

const initialState: MapState = {
  userLocation: null,
  nearbyUsers: [] ,
  selectedUser: null,
  region: null,
  isLoading: false,
  isLocationLoading: false,
  error: null,
  lastLocationUpdate: null,
  locationPermissionStatus: null,
};

// Async thunks
export const fetchNearbyUsersAsync = createAsyncThunk<User[], SearchUsersRequest, { rejectValue: AppError }>(
    'map/fetchNearbyUsers',
    async (params, { rejectWithValue }) => {
      try {
        // FIX: Use the unified apiClient
        const users = await apiClient.get<User[]>('/users/nearby', { params });
        return users;
      } catch (error) {
        return rejectWithValue(error as AppError);
      }
    }

export const updateUserLocationAsync = createAsyncThunk(
  'map/updateUserLocation',
  async (location: UserLocation, { rejectWithValue }) => {
    try {
      const response = await fetch('/api/users/location', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(location),
      });

      if (!response.ok) {
        throw new Error('Failed to update location');
      }

      return location;
    } catch (error) {
      return rejectWithValue({
        code: 'UPDATE_LOCATION_FAILED',
        message: error instanceof Error ? error.message : 'Failed to update location',
      });
    }
  }
);

export const fetchNearbyUsersAsync = createAsyncThunk<User[], SearchUsersRequest, { rejectValue: AppError }>(
    'map/fetchNearbyUsers',
    async (params, { rejectWithValue }) => {
      try {
        // FIX: Use the unified apiClient
        const users = await apiClient.get<User[]>('/users/nearby', { params });
        return users;
      } catch (error) {
        return rejectWithValue(error as AppError);
      }
    },
    /// ... other reducers
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchNearbyUsersAsync.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchNearbyUsersAsync.fulfilled, (state, action: PayloadAction<User[]>) => {
        state.isLoading = false;
        state.nearbyUsers = action.payload;
      })
      .addCase(fetchNearbyUsersAsync.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as AppError;
      });
  },
});

export const {
  setUserLocation,
  setRegion,
  setSelectedUser,
  addNearbyUser,
  removeNearbyUser,
  updateNearbyUser,
  clearNearbyUsers,
  setLocationPermissionStatus,
  clearError,
  setError,
} = mapSlice.actions;

// Selectors
export const selectMapState = (state: { map: MapState }) => state.map;
export const selectNearbyUsers = (state: { map: MapState }) => state.map.nearbyUsers;
export const selectUserLocation = (state: { map: MapState }) => state.map.userLocation;
export const selectSelectedUser = (state: { map: MapState }) => state.map.selectedUser;
export const selectMapRegion = (state: { map: MapState }) => state.map.region;
export const selectMapLoading = (state: { map: MapState }) => state.map.isLoading;
export const selectLocationLoading = (state: { map: MapState }) => state.map.isLocationLoading;
export const selectMapError = (state: { map: MapState }) => state.map.error;
export const selectLocationPermissionStatus = (state: { map: MapState }) => state.map.locationPermissionStatus;

export default mapSlice.reducer;
