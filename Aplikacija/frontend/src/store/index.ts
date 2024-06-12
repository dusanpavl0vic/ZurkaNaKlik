import { combineReducers, configureStore } from "@reduxjs/toolkit";
import storage from "redux-persist/lib/storage";
import { useDispatch } from "react-redux";
import api, { rtkErrorLogger } from "./api";
import {
  FLUSH,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
  REHYDRATE,
  persistReducer,
  persistStore,
} from "redux-persist";

import authReducer from "./auth/index";
import filtersReducer from "./filters/index";
import agencyFiltersReducer from "./agencyFilters";

const persistConfig = {
  key: "root",
  storage,
  whitelist: ["userSlice", "authSlice"],
};

// to config
const rootReducer = combineReducers({
  [api.reducerPath]: api.reducer,
  authSlice: authReducer,
  filtersSlice: filtersReducer,
  agencyFiltersSlice: agencyFiltersReducer,
});

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    })
      .concat(api.middleware)
      .concat(rtkErrorLogger),
});

export const persistor = persistStore(store);

export type RootState = ReturnType<typeof rootReducer>;
export type AppDispatch = typeof store.dispatch;
export const useAppDispatch: () => AppDispatch = useDispatch;
