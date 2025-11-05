import { useQuery, keepPreviousData } from '@tanstack/react-query';
import { getMoldMasterList } from '@primes/services/mold/moldMasterService';
import { MoldMasterSearchRequest } from '@primes/types/mold';

export const useMoldListQuery = (params: {
	searchRequest?: MoldMasterSearchRequest;
	page: number;
	size: number;
}) => {
	return useQuery({
		queryKey: [
			'mold',
			'list',
			params.searchRequest,
			params.page,
			params.size,
		],
		queryFn: () =>
			getMoldMasterList({
				searchRequest: params.searchRequest,
				page: params.page,
				size: params.size,
			}),
		placeholderData: keepPreviousData,
		staleTime: 1000 * 60 * 3,
		// ✅ FIXED: Add retry and error handling
		retry: 2,
		retryDelay: 1000,
	});
};
