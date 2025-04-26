import { useQuery } from '@tanstack/react-query';
import { getUsers } from '../api';

/**
 * React Query hook for fetching users
 * @returns {Object} - Query result with users data, loading state, and error
 */
export const useUsers = () => {
  return useQuery({
    queryKey: ['users'],
    queryFn: getUsers
  });
};
