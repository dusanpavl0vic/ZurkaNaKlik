import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import { initialState } from "./initialState";
import { Filters, FiltersData, PaginationData, Sort } from "./types";

export const filtersSlice = createSlice({
  name: "filters",
  initialState,
  reducers: {
    setFilters: (state, { payload }: PayloadAction<Filters>) => {
      state.filtersData = payload.filtersData;
      state.paginationData = payload.paginationData;
      state.sort = payload.sort;
    },
    setFiltersData: (state, { payload }: PayloadAction<FiltersData>) => {
      state.filtersData = payload;
    },
    setPaginationData: (state, { payload }: PayloadAction<PaginationData>) => {
      state.paginationData = payload;
    },
    setSortingData: (state, { payload }: PayloadAction<Sort>) => {
      state.sort = payload;
    },
    clearFilters: (state) => {
      state.filtersData = initialState.filtersData;
      state.paginationData = initialState.paginationData;
      state.sort = initialState.sort;
    },
  },
});

export const { setFilters, setFiltersData, setPaginationData, setSortingData } =
  filtersSlice.actions;
export * from "./selectors";
export default filtersSlice.reducer;
