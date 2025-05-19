'use client';

import {
  useQuery as useTanstackQuery,
  useMutation
} from '@tanstack/react-query';
import { fetchApi } from '@/lib/api';

/**
 * Custom hook for data fetching with TanStack Query
 * @param {string} key - The query key
 * @param {string} endpoint - The API endpoint
 * @param {Object} options - Query options
 * @returns {Object} - The query result
 */
export function useApiQuery(key, endpoint, options = {}) {
  const { queryOptions = {}, fetchOptions = {} } = options;

  return useTanstackQuery({
    queryKey: Array.isArray(key) ? key : [key],
    queryFn: () => fetchApi(endpoint, { method: 'GET', ...fetchOptions }),
    ...queryOptions
  });
}

/**
 * Custom hook for mutations with TanStack Query
 * @param {Object} options - Mutation options
 * @returns {Object} - The mutation result
 */
export function useApiMutation(options = {}) {
  const { mutationOptions = {}, endpoint } = options;

  return useMutation({
    mutationFn: data => {
      const { method = 'POST', ...fetchOptions } = options.fetchOptions || {};
      return fetchApi(endpoint, {
        method,
        body: JSON.stringify(data),
        ...fetchOptions
      });
    },
    ...mutationOptions
  });
}