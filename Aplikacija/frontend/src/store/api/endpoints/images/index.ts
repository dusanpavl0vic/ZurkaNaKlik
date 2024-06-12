import api from "../..";
import { providesSingle } from "../../utils";
import {
  DeleteOglasImageDTO,
  UploadMenuDTO,
  UploadMultipleOglasDTO,
  UploadOglasDTO,
} from "./types";

const authApiSlice = api.injectEndpoints({
  endpoints: (builder) => ({
    getImage: builder.query<string, string>({
      query: (location) => ({
        url: `Pregled/get-sliku/${location}`,
        responseHandler: (response) => response.blob(),
      }),
      transformResponse: (response) => URL.createObjectURL(response as Blob),
      providesTags: () => [
        { type: "Image", id: "IMAGEOGLAS" },
        { type: "Image", id: "IMAGEKORISNIK" },
        { type: "Image", id: "IMAGEAGENCY" },
        { type: "Image", id: "IMAGEMENU" },
        { type: "Image", id: "IMAGEAGENCYMENU" },
      ],
    }),
    uploadKorisnik: builder.mutation<void, FormData>({
      query: (formData) => ({
        url: "Korisnik/uploadKorisnik",
        method: "POST",
        body: formData,
      }),
      invalidatesTags: () => [
        { type: "User", id: "LISTUSER" },
        { type: "Image", id: "IMAGEKORISNIK" },
      ],
    }),
    uploadAgency: builder.mutation<void, FormData>({
      query: (formData) => ({
        url: "Agencija/AzurirajSlikuAgencije",
        method: "PUT",
        body: formData,
      }),
      invalidatesTags: () => [
        { type: "Agency", id: "LISTAGENCY" },
        { type: "Image", id: "IMAGEAGENCY" },
      ],
    }),
    uploadOglas: builder.mutation<void, UploadOglasDTO>({
      query: (body) => ({
        url: `Korisnik/uploadOglas/${body.id}`,
        method: "POST",
        body: body.formData,
      }),
      invalidatesTags: (result, err, args) => [
        { type: "Oglas", id: args.id },
        { type: "Image", id: "IMAGEOGLAS" },
      ],
    }),
    uploadMultipleOglas: builder.mutation<void, UploadMultipleOglasDTO>({
      query: (body) => ({
        url: `Korisnik/uploadOglasListaSlika/${body.id}`,
        method: "POST",
        body: body.files,
      }),
      invalidatesTags: (result, err, args) => [
        { type: "Oglas", id: args.id },
        { type: "Image", id: "IMAGEOGLAS" },
      ],
    }),
    deleteOglasImage: builder.mutation<void, DeleteOglasImageDTO>({
      query: (body) => ({
        url: `Korisnik/ObrisiSlikuOglasa/${body.idOglasa}/${body.slikaPath}`,
        method: "DELETE",
      }),
      invalidatesTags: (result, err, args) => [
        { type: "Oglas", id: args.idOglasa },
        { type: "Image", id: "IMAGEOGLAS" },
      ],
    }),
    uploadMenu: builder.mutation<void, UploadMenuDTO>({
      query: (body) => ({
        url: `Agencija/UploadujSlikuMenija/${body.idMenija}`,
        method: "POST",
        body: body.formData,
      }),
      invalidatesTags: (result, err, args) => [
        { type: "AgencyMenu", id: args.idMenija },
        { type: "AgencyMenu", id: "LISTAGENCYMENU" },
        { type: "Image", id: "IMAGEMENU" },
        { type: "Image", id: "IMAGEAGENCYMENU" },
      ],
    }),
  }),
});

export const {
  useGetImageQuery,
  useLazyGetImageQuery,
  useUploadKorisnikMutation,
  useUploadAgencyMutation,
  useUploadOglasMutation,
  useUploadMultipleOglasMutation,
  useDeleteOglasImageMutation,
  useUploadMenuMutation,
} = authApiSlice;
