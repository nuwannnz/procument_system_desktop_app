/* eslint-disable no-console */
/* eslint-disable promise/catch-or-return */
import axios from 'axios';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
// eslint-disable-next-line import/no-cycle
import { AppThunk, RootState } from '../../store';
import API from '../../constants/API.json';

type LoginPayload = {
  id: number;
  role: number;
  email: string;
  token: string;
};

const loginSlice = createSlice({
  name: 'login',
  initialState: {
    isAuth: false,
    token: '',
    role: -1,
    email: '',
    id: -1,
    loading: false,
  },
  reducers: {
    login: (state, action: PayloadAction<LoginPayload>) => {
      state.isAuth = true;
      state.role = action.payload.role;
      state.email = action.payload.email;
      state.id = action.payload.id;
      state.token = action.payload.token;
    },
    logout: (state) => {
      state.isAuth = false;
      state.role = -1;
      state.email = '';
      state.id = -1;
      state.token = '';
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
  },
});

const { login, setLoading } = loginSlice.actions;
export const { logout } = loginSlice.actions;

// export const loginAsync = (): AppThunk => {
//   return (dispatch, getState) => {
//     const state = getState();
//     if (state.counter.value % 2 === 0) {
//       return;
//     }
//     dispatch(increment());
//   };
// };

export const loginAsync = (
  userEmail: string,
  password: string
): AppThunk => async (dispatch) => {
  setLoading(true);

  const result = await axios.post(`${API.API_URL}/users/login`, {
    email: userEmail,
    password,
  });

  setLoading(false);
  if (result.data) {
    if (result.data.isAuth) {
      const { email, id, userRole } = result.data.userInfo;
      dispatch(login({ email, id, role: userRole, token: result.data.token }));
    }
    return true;
  }
  return false;
};

export default loginSlice.reducer;

export const selectIsAuth = (state: RootState) => state.login.isAuth;
export const selectAuthToken = (state: RootState) => state.login.token;
export const selectAuthEmail = (state: RootState) => state.login.email;
export const selectAuthRole = (state: RootState) => state.login.role;
export const selectIsLoading = (state: RootState) => state.login.loading;
