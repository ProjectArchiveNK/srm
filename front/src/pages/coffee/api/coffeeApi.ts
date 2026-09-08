import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import type { Month } from "../types/coffee";

export const coffeeApi = createApi({
  reducerPath: "coffeeApi",
  baseQuery: fetchBaseQuery({
    // baseUrl: "https://srm-backend-3a7x.onrender.com",
    baseUrl: import.meta.env.VITE_API_URL,
  }),
  tagTypes: ["Months"],
  endpoints: (builder) => ({
    createMonth: builder.mutation({
      query: (month) => ({
        url: "/coffee",
        method: "POST",
        body: month,
      }),
      invalidatesTags: ["Months"],
    }),
    getMonths: builder.query<Month[], void>({
      query: () => ({
        url: "/coffee",
        method: "GET",
      }),
      providesTags: ["Months"],
    }),
    addRow: builder.mutation({
      query: ({ selectedMonthId, newRow }) => ({
        url: `/coffee/${selectedMonthId}/row`,
        method: "POST",
        body: newRow,
      }),
      invalidatesTags: ["Months"],
    }),
    updateRow: builder.mutation({
      query: ({ selectedMonthId, rowId, editingRow }) => ({
        url: `/coffee/${selectedMonthId}/row/${rowId}`,
        method: "PATCH",
        body: editingRow,
      }),
      invalidatesTags: ["Months"],
    }),
    deleteRow: builder.mutation({
      query: ({ selectedMonthId, rowId }) => ({
        url: `/coffee/${selectedMonthId}/row/${rowId}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Months"],
    }),
    deleteMonth: builder.mutation({
      query: (monthId) => ({
        url: `/coffee/${monthId}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Months"],
    }),
    updateMonth: builder.mutation({
      query: ({ monthId, newNameMonth }) => ({
        url: `/coffee/${monthId}`,
        method: "PATCH",
        body: { newNameMonth },
      }),
      invalidatesTags: ["Months"],
    }),
  }),
});

export const {
  useCreateMonthMutation,
  useGetMonthsQuery,
  useAddRowMutation,
  useUpdateRowMutation,
  useDeleteRowMutation,
  useDeleteMonthMutation,
  useUpdateMonthMutation,
} = coffeeApi;
