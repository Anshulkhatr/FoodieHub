import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axiosInstance from '../../utils/axiosInstance';

const userInfo = JSON.parse(localStorage.getItem('userInfo'));

const initialState = {
  user: userInfo || null,
  isLoading: false,
  error: null,
};

export const login = createAsyncThunk('auth/login', async (userData, thunkAPI) => {
  try {
    const res = await axiosInstance.post('/auth/login', userData);
    localStorage.setItem('userInfo', JSON.stringify(res.data));
    return res.data;
  } catch (error) {
    return thunkAPI.rejectWithValue(error.response?.data?.message || error.message);
  }
});

export const registerUser = createAsyncThunk('auth/register', async (userData, thunkAPI) => {
  try {
    const res = await axiosInstance.post('/auth/register', userData);
    localStorage.setItem('userInfo', JSON.stringify(res.data));
    return res.data;
  } catch (error) {
    return thunkAPI.rejectWithValue(error.response?.data?.message || error.message);
  }
});

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    logout: (state) => {
      localStorage.removeItem('userInfo');
      state.user = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(login.pending, (state) => { state.isLoading = true; state.error = null; })
      .addCase(login.fulfilled, (state, action) => { state.isLoading = false; state.user = action.payload; })
      .addCase(login.rejected, (state, action) => { state.isLoading = false; state.error = action.payload; })
      .addCase(registerUser.pending, (state) => { state.isLoading = true; state.error = null; })
      .addCase(registerUser.fulfilled, (state, action) => { state.isLoading = false; state.user = action.payload; })
      .addCase(registerUser.rejected, (state, action) => { state.isLoading = false; state.error = action.payload; });
  },
});

export const { logout } = authSlice.actions;
export default authSlice.reducer;
