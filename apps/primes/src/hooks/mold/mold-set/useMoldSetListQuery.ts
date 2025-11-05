import { useQuery } from '@tanstack/react-query';
import { getMoldSetList } from '@primes/services/mold/moldSetService';
import { MoldSetMasterSearchRequest } from '@primes/types/mold';

export const useMoldSetListQuery = (params: {
	searchRequest?: MoldSetMasterSearchRequest;
	page: number;
	size: number;
}) => {
	const { searchRequest = {}, page, size } = params;

	return useQuery({
		queryKey: ['moldSet', searchRequest, page, size],
		queryFn: () => getMoldSetList(searchRequest, page, size),
		enabled: true,
		staleTime: 5 * 60 * 1000, // 5분
		gcTime: 10 * 60 * 1000, // 10분
	});
};