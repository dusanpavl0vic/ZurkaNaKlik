import { RootState } from "..";

export const selectFilters = (state: RootState) => state.filtersSlice;
export const selectFiltersData = (state: RootState) =>
  state.filtersSlice.filtersData;
export const selectPaginationData = (state: RootState) =>
  state.filtersSlice.paginationData;
export const selectSortData = (state: RootState) => state.filtersSlice.sort;
