import { createApi , fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const api = createApi({
    baseQuery: fetchBaseQuery({ baseUrl: process.env.REACT_APP_BASE_URL }),
    reducerPath: 'adminApi',
    tagTypes: ['User'],
    endpoints: (bulid) => ({
        getUser: bulid.query({
            // user id
            query: (id) => `dashboard/user/${id}`,
            providesTags: ['User'],
        })
    })
})

export const { useGetUserQuery } = api;
