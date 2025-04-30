import { useQuery } from '@tanstack/react-query';
import { getUsers } from '../api';

/**
 * React Query hook for fetching users with pagination and filters
 * @param {Object} options - Options for pagination and filtering
 * @param {number} options.page - Current page number
 * @param {number} options.limit - Number of results per page
 * @param {string} options.status - Filter by status (active, inactive, or all)
 * @param {string} options.search - Search term to filter results
 * @returns {Object} - Query result with users data, loading state, and error
 */
const useUsers = ({
  page = 1,
  limit = 10,
  status = 'all',
  search = ''
} = {}) => {
  return useQuery({
    queryKey: ['users', page, limit, status, search],
    queryFn: () => getUsers({ page, limit, status, search })
  });
};

export default useUsers;
