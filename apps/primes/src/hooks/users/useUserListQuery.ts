import { useQuery, keepPreviousData } from '@tanstack/react-query';
import { getAllUserList } from '@primes/services/users/userService';
import { GetAllUserListPayload } from '@primes/types/users';

export const useUserListQuery = (params: GetAllUserListPayload) => {
	const { page = 0, size = 10, searchRequest = {} } = params;

	return useQuery({
		queryKey: ['users', page, size, searchRequest] as const,
		queryFn: () => getAllUserList({ searchRequest, page, size }),
		placeholderData: keepPreviousData,
		staleTime: 1000 * 60 * 3,
	} as const);
};
