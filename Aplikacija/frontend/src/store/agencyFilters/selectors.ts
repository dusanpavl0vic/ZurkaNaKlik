import { RootState } from "..";

export const selectAgencyFilters = (state: RootState) => state.agencyFiltersSlice;
export const selectAgencyFiltersData = (state: RootState) =>
  state.agencyFiltersSlice.filtersData;
export const selectAgencyPaginationData = (state: RootState) =>
  state.agencyFiltersSlice.paginationData;
export const selectAgencySortData = (state: RootState) => state.agencyFiltersSlice.sort;