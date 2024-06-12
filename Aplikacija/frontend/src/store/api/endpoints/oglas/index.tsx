import { Filters, FiltersData } from "@/store/filters/types";
import api from "../..";
import { providesList, providesSingle } from "../../utils";
import {
  AddOglasObjektaDTO,
  FilteredOglasObjektaRequest,
  FilteredOglasObjektaResponse,
  OglasObjekata,
  UpdateOglasObjektaDTO,
} from "./types";

const authApiSlice = api.injectEndpoints({
  endpoints: (builder) => ({
    getAllCities: builder.query<string[], void>({
      query: () => ({
        url: "Oglas/VratiSveGradove",
      }),
      providesTags: () => providesList("Location"),
    }),
    getFilteredOglases: builder.query<FilteredOglasObjektaResponse, FilteredOglasObjektaRequest>({
      query: (body) => ({
        url: `Oglas/MixVratiOglase/${body.paginationData.pageNumber}/${body.paginationData.pageSize}/${body.sort}`,
        method: "POST",
        body: body.filtersData,
      }),
    }),
    getOglas: builder.query<OglasObjekata, number>({
      query: (id) => ({
        url: `Oglas/PrikaziOglas/${id}`,
      }),
      providesTags: (result) => providesSingle("Oglas", result?.id),
    }),
    // PREBACI U KORISNIKA
    getUserOglasi: builder.query<OglasObjekata[], void>({
      query: () => ({
        url: `Korisnik/PrikaziOglaseKorisnika`,
      }),
      providesTags: (result) => providesList("Oglas", result),
    }),
    addUserOglas: builder.mutation<OglasObjekata, AddOglasObjektaDTO>({
      query: (body) => ({
        url: "Korisnik/DodajOglas",
        method: "POST",
        body,
      }),
      invalidatesTags: (result, err, args) => [
        { type: "Oglas", id: "LISTOGLAS" },
        { type: "Oglas", id: result?.id },
      ],
    }),
    updateUserOglas: builder.mutation<OglasObjekata, UpdateOglasObjektaDTO>({
      query: (body) => ({
        url: "Korisnik/IzmeniOglas",
        method: "PUT",
        body,
      }),
      invalidatesTags: (result, err, args) => [
        { type: "Oglas", id: "LISTOGLAS" },
        { type: "Oglas", id: result?.id },
      ],
    }),
    deleteUserOglas: builder.mutation<void, number>({
      query: (id) => ({
        url: `Korisnik/ObrisiOglas/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: (result, err, args) => [
        { type: "Oglas", id: "LISTOGLAS" },
        { type: "Oglas", id: args },
      ],
    }),
    getKorisnikOglasi: builder.query<OglasObjekata[], number>({
      query: (id) => ({
        url: `Pregled/PrikaziOglaseKorisnika/${id}`,
      }),
      providesTags: (result) => providesList("Oglas", result),
    }),
  }),
});

export const {
  useGetAllCitiesQuery,
  useGetFilteredOglasesQuery,
  useGetOglasQuery,
  useLazyGetOglasQuery,
  useGetUserOglasiQuery,
  useAddUserOglasMutation,
  useUpdateUserOglasMutation,
  useDeleteUserOglasMutation,
  useGetKorisnikOglasiQuery,
} = authApiSlice;
