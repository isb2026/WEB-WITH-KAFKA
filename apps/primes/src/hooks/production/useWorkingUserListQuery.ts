import { useQuery, keepPreviousData } from '@tanstack/react-query';
import { getWorkingUserList } from '@primes/services/production';
import { WorkingUserSearchParams } from '@primes/types/production';

interface UseWorkingUserListQueryParams extends WorkingUserSearchParams {
	page?: number;
	size?: number;
}

export const useWorkingUserListQuery = (
	params: UseWorkingUserListQueryParams
) => {
	const { page = 0, size = 10, ...searchParams } = params;

	return useQuery({
		queryKey: ['working-user', { page, size, ...searchParams }],
		queryFn: () => getWorkingUserList(searchParams, page, size),
		placeholderData: keepPreviousData,
	});
};
