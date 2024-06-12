import api from "../..";
import { providesList, providesSingle } from "../../utils";
import { OglasObjekata } from "../oglas/types";
import {
  AllUserData,
  MakeCateringReservationDTO,
  MakeReservationDTO,
  Oceni,
  RemoveCateringReservationDTO,
  ReservedOglas,
  UpdateUserDTO,
} from "./types";

const authApiSlice = api.injectEndpoints({
  endpoints: (builder) => ({
    getUserData: builder.query<AllUserData, number>({
      query: (id) => ({
        url: `Pregled/GetKorisnik/${id}`,
      }),
      providesTags: (result) => providesSingle("User", result?.id),
    }),
    updateUser: builder.mutation<AllUserData, UpdateUserDTO>({
      query: (body) => ({
        url: "Korisnik/IzmeniPodatkeOKorisniku",
        method: "PUT",
        body,
      }),
      invalidatesTags: (result, err, arg) => [
        { type: "User", id: result?.id },
        { type: "User", id: "LISTUSER" },
      ],
    }),
    getFavourites: builder.query<OglasObjekata[], void>({
      query: () => ({
        url: "Korisnik/PrikaziSveOmiljeneOglase",
      }),
      providesTags: (result) => providesList("OmiljeniOglasi", result),
    }),
    addFavourite: builder.mutation<OglasObjekata, number>({
      query: (id) => ({
        url: `Korisnik/DodajOmiljeniOglas/${id}`,
        method: "PUT",
      }),
      invalidatesTags: (result, err, arg) => [
        { type: "OmiljeniOglasi", id: result?.id },
        { type: "OmiljeniOglasi", id: "LISTOMILJENIOGLASI" },
      ],
    }),
    deleteFavourite: builder.mutation<OglasObjekata, number>({
      query: (id) => ({
        url: `Korisnik/ObrisiOmiljeniOglas/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: (result, err, arg) => [
        { type: "OmiljeniOglasi", id: result?.id },
        { type: "OmiljeniOglasi", id: "LISTOMILJENIOGLASI" },
      ],
    }),
    deleteUser: builder.mutation<void, void>({
      query: () => ({
        url: `Korisnik/ObrisiKorisnika`,
        method: "DELETE",
      }),
      invalidatesTags: (result, err, arg) => [{ type: "User", id: "LISTUSER" }],
    }),
    isFavorite: builder.query<boolean, number>({
      query: (id) => ({
        url: `Korisnik/DaLiOmiljen/${id}`,
      }),
      providesTags: (result, error, id) => [{ type: "OmiljeniOglasi", id }],
    }),
    oceniAgenciju: builder.mutation<boolean, Oceni>({
      query: (body) => ({
        url: `Korisnik/OceniAgenciju/${body.id}/${body.ocena}`,
        method: "PUT",
      }),
      invalidatesTags: (result, err, arg) => [
        { type: "Agency", id: arg.id },
        { type: "Agency", id: "LISTAGENCY" },
      ],
    }),
    oceniOglas: builder.mutation<boolean, Oceni>({
      query: (body) => ({
        url: `Korisnik/OceniOglas/${body.id}/${body.ocena}`,
        method: "PUT",
      }),
      invalidatesTags: (result, err, arg) => [
        { type: "Oglas", id: arg.id },
        { type: "Oglas", id: "LISTOGLAS" },
        { type: "ReservedOglasi", id: "RESERVEDOGLASI" },
      ],
    }),
    getReservedOglasi: builder.query<ReservedOglas[], void>({
      query: () => ({
        url: "Korisnik/PrikaziSveZakupljeneOglase",
      }),
      providesTags: (result) => providesList("ReservedOglasi", result),
    }),
    makeReservation: builder.mutation<ReservedOglas, MakeReservationDTO>({
      query: (body) => ({
        url: `Korisnik/ZakupiOglas/${body.idOglasa}`,
        method: "POST",
        body: body.trazeniDatumi,
      }),
      invalidatesTags: (result, err, arg) => [
        { type: "Oglas", id: result?.oglasId },
        { type: "ReservedOglasi", id: result?.id },
        { type: "ReservedOglasi", id: "LISTRESERVEDOGLASI" },
      ],
    }),
    removeReservation: builder.mutation<number, number>({
      query: (id) => ({
        url: `Korisnik/OtkaziRezervacijuObjekta/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: (result, err, arg) => [
        { type: "Oglas", id: "LISTOGLAS" },
        { type: "ReservedOglasi", id: result },
        { type: "ReservedOglasi", id: "LISTRESERVEDOGLASI" },
        { type: "CateringOrder", id: "LISTCATERINGORDER" },
      ],
    }),
    makeCateringReservation: builder.mutation<
      CateringOrder,
      MakeCateringReservationDTO
    >({
      query: (body) => ({
        url: `Korisnik/PosaljiZahtevZaKetering/${body.idZakupljenOglas}/${body.idAgencije}/${body.mogucnostDostave}`,
        method: "POST",
        body: body.porucenMeni,
      }),
      invalidatesTags: (result, err, arg) => [
        // { type: "Oglas", id: result?.oglasId },
        { type: "CateringOrder", id: result?.id },
        { type: "CateringOrder", id: "LISTCATERINGORDER" },
        { type: "ReservedOglasi", id: "LISTRESERVEDOGLASI" },
      ],
    }),
    removeCateringReservation: builder.mutation<
      number,
      RemoveCateringReservationDTO
    >({
      query: (body) => ({
        url: `Korisnik/OtkaziZahtevZaKetering/${body.idCatering}/${body.idReservedOglas}`,
        method: "DELETE",
      }),
      invalidatesTags: (result, err, arg) => [
        { type: "CateringOrder", id: result },
        { type: "CateringOrder", id: "LISTCATERINGORDER" },
        { type: "ReservedOglasi", id: "LISTRESERVEDOGLASI" },
      ],
    }),
  }),
});

export const {
  useGetUserDataQuery,
  useUpdateUserMutation,
  useGetFavouritesQuery,
  useAddFavouriteMutation,
  useDeleteFavouriteMutation,
  useDeleteUserMutation,
  useIsFavoriteQuery,
  useGetReservedOglasiQuery,
  useMakeReservationMutation,
  useMakeCateringReservationMutation,
  useOceniAgencijuMutation,
  useOceniOglasMutation,
  useRemoveReservationMutation,
  useRemoveCateringReservationMutation,
} = authApiSlice;
