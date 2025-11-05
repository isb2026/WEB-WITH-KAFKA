import { useQuery } from '@tanstack/react-query';
import { getMoldInstanceList } from '@primes/services/mold/moldInstanceService';
import { MoldInstanceSearchRequest } from '@primes/types/mold';
import { keepPreviousData } from '@tanstack/react-query';

export const useMoldInstanceListQuery = (params: {
	searchRequest?: MoldInstanceSearchRequest;
	page: number;
	size: number;
}) => {
	const { searchRequest = {}, page, size } = params;

	return useQuery({
		queryKey: ['moldInstance', searchRequest, page, size],
		queryFn: () => getMoldInstanceList(searchRequest, page, size),
		enabled: true,
		staleTime: 5 * 60 * 1000, // 5분
		gcTime: 10 * 60 * 1000, // 10분
		placeholderData: keepPreviousData,
	});
};