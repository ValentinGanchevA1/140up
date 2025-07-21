import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { User, AppError } from '@/types';

interface UserState {
  profiles: Record<string, User>;
  isLoading: boolean;
  error: AppError | null;
}

const initialState: UserState = {
  profiles: {},
  isLoading: false,
  error: null,
};


const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setUser: (state, action: PayloadAction<User>) => {
      state.profiles[action.payload.id] = action.payload;
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
    setError: (state, action: PayloadAction<AppError | null>) => {
      state.error = action.payload;
    },
  },
});

export const { setUser, setLoading, setError } = userSlice.actions;
export default userSlice.reducer;
