import { createApi , fetchBaseQuery } from '@reduxjs/toolkit/query/react';

// export const api = createApi({
//     baseQuery: fetchBaseQuery({ baseUrl: process.env.REACT_APP_BASE_URL }),
//     reducerPath: 'adminApi',
//     tagTypes: ['User'],
//     endpoints: (bulid) => ({
//         getUser: bulid.query({
//             // user id
//             query: (id) => `dashboard/user/${id}`,
//             providesTags: ['User'],
//         })
//     })
// })

// export async function fetchMetrics(userId, serviceName, metricName) {
//     const response = await fetch(`ws://localhost:3000/getMetricData?userId=${userId}&serviceName=${serviceName}&metricName=${metricName}`);
//     if (!response.ok) {
//       throw new Error('Failed to fetch metrics');
//     }
//     const data = await response.json();
//     return data;
//   }

// export const { useGetUserQuery } = api;
