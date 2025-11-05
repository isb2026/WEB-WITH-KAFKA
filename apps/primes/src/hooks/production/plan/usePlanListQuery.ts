import { useQuery, keepPreviousData } from '@tanstack/react-query';
import { getPlanList } from '@primes/services/production/planService';
import { PlanSearchRequest } from '@primes/types/production';

interface PlanListParams {
	page?: number;
	size?: number;
	searchRequest?: PlanSearchRequest;
}

export const usePlanListQuery = (params: PlanListParams = {}) => {
	const { page = 0, size = 10, searchRequest = {} } = params;

	return useQuery({
		queryKey: ['Plan', page, size, searchRequest],
		queryFn: () => getPlanList(searchRequest, page, size),
		placeholderData: keepPreviousData,
		staleTime: 1000 * 60 * 3, // 3분간 캐시 유지
	});
};
