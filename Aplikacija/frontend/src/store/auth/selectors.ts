import { RootState } from "..";

export const selectAuthState = (state: RootState) => state.authSlice;
export const selectAuthToken = (state: RootState) =>
  state.authSlice.accessToken;
export const selectUser = (state: RootState) => state.authSlice.user;
export const selectIsFirstLogin = (state: RootState) => state.authSlice.firstLogin;

