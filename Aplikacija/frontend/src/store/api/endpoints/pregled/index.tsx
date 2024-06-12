import { AgencyFilters } from "@/store/agencyFilters/types";
import api from "../..";
import { providesList, providesSingle } from "../../utils";
import { FilteredAgenciesDTO } from "./types";

const authApiSlice = api.injectEndpoints({
  endpoints: (builder) => ({
    getAgencyMenues: builder.query<GetMenuDTO[], number>({
      query: (id) => ({
        url: `Pregled/VratiSveKategorijeIMenijeAgencije/${id}`,
      }),
    }),
    getAgencyListMenues: builder.query<MenuForList[], number[]>({
      query: (ids) => ({
        url: `Pregled/VratiMenijeLista`,
        method: "POST",
        body: ids,
      }),
      providesTags: (result) => providesList("PregledMenu", result),
    }),
    getAllGlobalCategories: builder.query<string[], void>({
      query: () => ({
        url: `Pregled/VratiNaziveKategorija`,
      }),
      // providesTags: (result) => providesList("Categories", result),
    }),
    getFilteredAgencies: builder.query<FilteredAgenciesDTO, AgencyFilters>({
      query: (body) => ({
        url: `Pregled/VratiAgencije/${body.paginationData.pageNumber}/${body.paginationData.pageSize}/${body.sort}`,
        method: "POST",
        body: body.filtersData,
      }),
      providesTags: (result) => providesList("Agency", result?.response),
    }),
  }),
});

export const {
  useGetAgencyMenuesQuery,
  useGetAgencyListMenuesQuery,
  useGetAllGlobalCategoriesQuery,
  useGetFilteredAgenciesQuery,
} = authApiSlice;
