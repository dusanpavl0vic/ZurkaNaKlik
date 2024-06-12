import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import { initialState } from "./initialState";
import { AgencyFilters, AgencyFiltersData, AgencySort } from "./types";
import { PaginationData } from "../filters/types";

export const agencyFiltersSlice = createSlice({
  name: "agencyFilters",
  initialState,
  reducers: {
    setAgencyFilters: (state, { payload }: PayloadAction<AgencyFilters>) => {
      state.filtersData = payload.filtersData;
      state.paginationData = payload.paginationData;
      state.sort = payload.sort;
    },
    setAgencyFiltersData: (state, { payload }: PayloadAction<AgencyFiltersData>) => {
      state.filtersData = payload;
    },
    setAgencyPaginationData: (state, { payload }: PayloadAction<PaginationData>) => {
      state.paginationData = payload;
    },
    setAgencySortingData: (state, { payload }: PayloadAction<AgencySort>) => {
      state.sort = payload;
    },
    clearAgencyFilters: (state) => {
      state.filtersData = initialState.filtersData;
      state.paginationData = initialState.paginationData;
      state.sort = initialState.sort;
    },
  },
});

export const { setAgencyFilters, setAgencyFiltersData, setAgencyPaginationData, setAgencySortingData } =
  agencyFiltersSlice.actions;
export * from "./selectors";
export default agencyFiltersSlice.reducer;
