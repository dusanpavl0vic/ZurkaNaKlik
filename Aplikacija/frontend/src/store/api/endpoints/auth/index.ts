import api from "../..";
import { CreateAgencyDTO, CreateUserDTO, LoginPayload, LoginResponse } from "./types";

const authApiSlice = api.injectEndpoints({
  endpoints: (builder) => ({
    userSignUp: builder.mutation<LoginResponse, CreateUserDTO>({
      query: (body) => ({
        url: "Auth/RegistrationKorisnik",
        method: "Post",
        body,
      }),
    }),
    agencySignUp: builder.mutation<LoginResponse, CreateAgencyDTO>({
      query: (body) => ({
        url: "Auth/RegistrationAgencija",
        method: "Post",
        body,
      }),
    }),
    userLogin: builder.mutation<LoginResponse, LoginPayload>({
      query: (body) => ({ url: "Auth/login", method: "POST", body }),
    }),
    logout: builder.mutation<void, void>({
      query: () => ({
        url: `auth/user/logout`,
      }),
    }),
  }),
});

export const {
  useUserSignUpMutation,
  useAgencySignUpMutation,
  useUserLoginMutation,
  useLogoutMutation,
} = authApiSlice;
