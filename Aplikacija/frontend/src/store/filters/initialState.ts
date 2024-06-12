import { Filters, Sort } from "./types";

export const initialState: Filters = {
  filtersData: {
    tipProslava: [],
    tipProstora: [],
    grejanje: [],
    dodatnaOprema: [],
    cenaOd: undefined,
    cenaDo: undefined,
    grad: null,
    datumDo: undefined,
    datumOd: undefined,
    kvadraturaDo: undefined,
    kvadraturaOd: undefined,
  },
  paginationData: {
    pageNumber: 1,
    pageSize: 8,
  },
  sort: Sort.OcenaRastuce,
};
