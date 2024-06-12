import { AuthState } from "./types";

export const initialState: AuthState = {
  accessToken: null,
  user: null,
  firstLogin: null,
};
