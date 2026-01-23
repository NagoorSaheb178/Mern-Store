import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const api = createApi({
  reducerPath: "api",
  baseQuery: fetchBaseQuery({
    baseUrl: "/api",
    prepareHeaders: (headers, { getState }) => {
      const token = getState().auth.token;
      if (token) headers.set("authorization", `Bearer ${token}`);
      return headers;
    }
  }),
  tagTypes: ["Products", "Profile"],
  endpoints: (builder) => ({
    signup: builder.mutation({ query: (body) => ({ url: "/auth/signup", method: "POST", body }) }),
    login: builder.mutation({ query: (body) => ({ url: "/auth/login", method: "POST", body }) }),
    profile: builder.query({ query: () => ({ url: "/users/profile" }), providesTags: ["Profile"] }),

    getProducts: builder.query({ query: () => "/products", providesTags: ["Products"] }),
    createProduct: builder.mutation({
      query: (body) => ({ url: "/products", method: "POST", body }),
      invalidatesTags: ["Products"]
    }),
    updateProduct: builder.mutation({
      query: ({ id, ...body }) => ({ url: `/products/${id}`, method: "PUT", body }),
      invalidatesTags: ["Products"]
    }),
    patchProduct: builder.mutation({
      query: ({ id, ...body }) => ({ url: `/products/${id}`, method: "PATCH", body }),
      invalidatesTags: ["Products"]
    }),
    deleteProduct: builder.mutation({
      query: (id) => ({ url: `/products/${id}`, method: "DELETE" }),
      invalidatesTags: ["Products"]
    }),
    getProductById: builder.query({ query: (id) => `/products/${id}` }),
    getProductsByCategory: builder.query({ query: (c) => `/products/category/${c}` })
  })
});

export const {
  useSignupMutation, useLoginMutation, useProfileQuery,
  useGetProductsQuery, useCreateProductMutation, useUpdateProductMutation,
  usePatchProductMutation, useDeleteProductMutation,
  useGetProductByIdQuery, useGetProductsByCategoryQuery
} = api;
