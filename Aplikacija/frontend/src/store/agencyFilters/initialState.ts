import { AgencyFilters, AgencySort } from "./types";

export const initialState: AgencyFilters = {
  filtersData: {
    listaKategorija: [],
    cenaDostaveOd: undefined,
    cenaDostaveDo: undefined,
    mogucnostDostave: true,
    grad: undefined,
  },
  paginationData: {
    pageNumber: 1,
    pageSize: 10,
  },
  sort: AgencySort.OcenaOpadajuce,
};
