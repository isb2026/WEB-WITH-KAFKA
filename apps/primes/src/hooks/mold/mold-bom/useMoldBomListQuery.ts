import { useQuery } from '@tanstack/react-query';
import { getMoldBomMasterList } from '@primes/services/mold/moldBomService';
import { MoldBomMasterSearchRequest } from '@primes/types/mold';

export const useMoldBomListQuery = (params: {
	searchRequest?: MoldBomMasterSearchRequest;
	page: number;
	size: number;
}) => {
	const { searchRequest = {}, page, size } = params;

	return useQuery({
		queryKey: ['moldBom', searchRequest, page, size],
		queryFn: () => getMoldBomMasterList(searchRequest, page, size),
		enabled: true,
		staleTime: 5 * 60 * 1000, // 5분
		gcTime: 10 * 60 * 1000, // 10분
	});
};
