import api from "../..";
import { providesList, providesSingle } from "../../utils";

const authApiSlice = api.injectEndpoints({
  endpoints: (builder) => ({
    getAgencyData: builder.query<Agency, number>({
      query: (id) => ({
        url: `Pregled/PrikaziAgenciju/${id}`,
      }),
      providesTags: (result) => providesSingle("Agency", result?.id),
    }),
    updateAgencyData: builder.mutation<Agency, UpdateAgencyDTO>({
      query: (body) => ({
        url: "Agencija/AzurirajAgenciju",
        method: "PUT",
        body,
      }),
      invalidatesTags: (result, err, arg) => [
        { type: "Agency", id: result?.id },
        { type: "Agency", id: "LISTAGENCY" },
      ],
    }),
    deleteAgency: builder.mutation<void, number>({
      query: () => ({
        url: `Agencija/ObrisiAgenciju`,
        method: "DELETE",
      }),
      invalidatesTags: (result, err, arg) => [
        { type: "Agency", id: arg },
        { type: "Agency", id: "LISTAGENCY" },
      ],
    }),
    getAllCategories: builder.query<Category[], void>({
      query: () => ({
        url: "Agencija/VratiKategorije",
      }),
      providesTags: (result) => providesList("AgencyCategory", result),
    }),
    addCategory: builder.mutation<Category, AddCategoryDTO>({
      query: (body) => ({
        url: "Agencija/DodajKategoriju",
        method: "POST",
        body,
      }),
      invalidatesTags: (result, err, arg) => [
        { type: "AgencyCategory", id: result?.id },
        { type: "AgencyCategory", id: "LISTAGENCYCATEGORY" },
      ],
    }),
    deleteCategory: builder.mutation<void, number>({
      query: (id) => ({
        url: `Agencija/ObrisiKategoriju/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: (result, err, arg) => [
        { type: "AgencyCategory", id: arg },
        { type: "AgencyCategory", id: "LISTAGENCYCATEGORY" },
      ],
    }),
    // meniji
    getMenues: builder.query<GetMenuDTO[], void>({
      query: () => ({
        url: "Agencija/VratiMenije",
      }),
      providesTags: (result) => providesList("AgencyMenu", result),
    }),
    addMenu: builder.mutation<Menu, AddMenuDTO>({
      query: (addMenu) => ({
        url: `Agencija/DodajMeni/${addMenu.id}`,
        method: "POST",
        body: addMenu.menu,
      }),
      invalidatesTags: (result, err, arg) => [
        { type: "AgencyMenu", id: result?.id },
        { type: "AgencyMenu", id: "LISTAGENCYMENU" },
      ],
    }),
    updateMenu: builder.mutation<Menu, Menu>({
      query: (body) => ({
        url: `Agencija/AzurirajMeni`,
        method: "PUT",
        body,
      }),
      invalidatesTags: (result, err, arg) => [
        { type: "AgencyMenu", id: result?.id },
        { type: "AgencyMenu", id: "LISTAGENCYMENU" },
      ],
    }),
    deleteMenu: builder.mutation<Menu, number>({
      query: (id) => ({
        url: `Agencija/ObrisiMeni/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: (result, err, arg) => [
        { type: "AgencyMenu", id: arg },
        { type: "AgencyMenu", id: "LISTAGENCYMENU" },
      ],
    }),
    getCateringOrders: builder.query<CateringOrder[], void>({
      query: () => ({
        url: "Agencija/PrikaziSvePorudzbine",
      }),
      providesTags: (result) => providesList("CateringOrder", result),
    }),
    acceptOrder: builder.mutation<boolean, number>({
      query: (id) => ({
        url: `Agencija/OdobriPorudzbinu/${id}`,
        method: "PUT",
      }),
      invalidatesTags: (result, err, args) => [
        { type: "CateringOrder", id: args },
        { type: "CateringOrder", id: "LISTCATERINGORDER" },
      ],
    }),
    declineOrder: builder.mutation<boolean, number>({
      query: (id) => ({
        url: `Agencija/OdbijanjePorudzbine/${id}`,
        method: "GET",
      }),
      invalidatesTags: (result, err, args) => [
        { type: "CateringOrder", id: args },
        { type: "CateringOrder", id: "LISTCATERINGORDER" },
      ],
    }),
  }),
});

export const {
  useGetAgencyDataQuery,
  useUpdateAgencyDataMutation,
  useDeleteAgencyMutation,
  useGetAllCategoriesQuery,
  useAddCategoryMutation,
  useDeleteCategoryMutation,
  useGetMenuesQuery,
  useAddMenuMutation,
  useDeleteMenuMutation,
  useGetCateringOrdersQuery,
  useAcceptOrderMutation,
  useDeclineOrderMutation,
} = authApiSlice;
