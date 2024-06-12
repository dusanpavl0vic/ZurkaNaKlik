import {
  BaseQueryFn,
  FetchArgs,
  FetchBaseQueryError,
  createApi,
  fetchBaseQuery,
} from "@reduxjs/toolkit/query/react";
import { RootState } from "..";
import * as config from "../../../config.json";
import { logOut, setAuthState, setToken, setUser } from "../auth";
import { LoginResponse } from "./endpoints/auth/types";
import { Mutex } from "async-mutex";
import {
  Middleware,
  MiddlewareAPI,
  isRejectedWithValue,
} from "@reduxjs/toolkit";
import { toast } from "react-toastify";
import { ErrorObject } from "./types";
// import { setToken } from "../auth";
// import { logoutThunk, setUser } from "../user";
// import { LoginResponse } from "./endpoints/auth/types";

const mutex = new Mutex();

const baseQuery = fetchBaseQuery({
  baseUrl: config.publicApi,
  mode: "cors",
  credentials: "include",
  prepareHeaders: (headers, { getState }) => {
    const token = (getState() as RootState).authSlice.accessToken;
    headers.set("authorization", `Bearer ${token}`);
    return headers;
  },
});

const baseQueryWithAuth: BaseQueryFn<
  string | FetchArgs,
  unknown,
  FetchBaseQueryError
> = async (args, api, extraOptions) => {
  await mutex.waitForUnlock();
  let result = await baseQuery(args, api, extraOptions);

  if (
    (result.error?.status === 401 || result.error?.status === 403) &&
    !result.meta?.request.url.includes("/login") &&
    !result.meta?.request.url.includes("/RefreshToken")
  ) {
    if (mutex.isLocked() == false) {
      const release = await mutex.acquire();
      console.log("AQUIRED");
      try {
        console.log("tried");
        const refreshResult = await baseQuery(
          "/auth/RefreshToken",
          api,
          extraOptions
        );
        if (refreshResult.data) {
          const refreshResultData = refreshResult.data as LoginResponse;

          api.dispatch(setAuthState(refreshResultData));

          if (result.error?.status === 401) {
            result = await baseQuery(args, api, extraOptions);
          }
        } else if (refreshResult.error?.status === 401) {
          api.dispatch(logOut());
        }
      } finally {
        release();
      }
    }
  } else {
    await mutex.waitForUnlock();
    //result = await baseQuery(args, api, extraOptions);
  }

  return result;
};

export const rtkErrorLogger: Middleware =
  (api: MiddlewareAPI) => (next) => (action) => {
    if (isRejectedWithValue(action)) {
      const errorObject = action.payload as ErrorObject;

      if (
        !errorObject ||
        errorObject.status == "401" ||
        errorObject.status == "403"
      ) {
        return next(action);
      } else {
        toast.error(errorObject.data || "Unknown error");
        console.error("Error occured: ", errorObject);
      }
    }
    return next(action);
  };

export const api = createApi({
  reducerPath: "api",
  tagTypes: [
    "User",
    "Agency",
    "AgencyCategory",
    "AgencyMenu",
    "CateringOrder",
    "Location",
    "Oglas",
    "OmiljeniOglasi",
    "Image",
    "PregledMenu",
    "ReservedOglasi",
    "Categories",
  ],
  baseQuery: baseQueryWithAuth,
  endpoints: () => ({}),
});

export default api;
