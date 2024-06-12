import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import { initialState } from "./initialState";
import { User } from "@/models/user";
import { LoginResponse } from "../api/endpoints/auth/types";

export const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setToken: (state, { payload }: PayloadAction<string | null>) => {
      state.accessToken = payload;
    },
    setUser: (state, { payload }: PayloadAction<User>) => {
      state.user = payload;
    },
    setAuthState: (state, { payload }: PayloadAction<LoginResponse>) => {
      state.user = payload.loginResult;
      state.accessToken = payload.accessToken;
    },
    logOut: (state) => {
      state.accessToken = null;
      state.user = null;
    },
    setIsFirstLogin: (state, { payload }: PayloadAction<boolean>) => {
      state.firstLogin = payload;
    },
  },
});

export const { setToken, setUser, setAuthState, logOut, setIsFirstLogin } = authSlice.actions;
export * from "./selectors";
export default authSlice.reducer;
