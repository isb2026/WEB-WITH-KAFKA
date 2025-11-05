import { useQuery, keepPreviousData } from '@tanstack/react-query';
import { getLotList } from '@primes/services/production/lotService';
import { LotSearchRequest } from '@primes/types/production';

interface LotListParams {
	page?: number;
	size?: number;
	searchRequest?: LotSearchRequest;
}

export const useLotListQuery = (params: LotListParams = {}) => {
	const { page = 0, size = 10, searchRequest = {} } = params;

	return useQuery({
		queryKey: ['Lot', page, size, searchRequest],
		queryFn: () => getLotList(searchRequest, page, size),
		placeholderData: keepPreviousData,
		staleTime: 1000 * 60 * 3, // 3분간 캐시 유지
	});
};
