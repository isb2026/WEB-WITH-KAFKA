import { useQuery } from '@tanstack/react-query';
import { getMoldBomDetailList } from '@primes/services/mold/moldBomService';

export const useMoldBomDetailByMasterId = (
	masterId: number,
	page: number,
	size: number
) => {
	return useQuery({
		queryKey: ['moldBomDetail', masterId, page, size],
		queryFn: () => getMoldBomDetailList({ moldBomMasterId: masterId }, page, size),
		enabled: masterId > 0,
		staleTime: 5 * 60 * 1000, // 5분
		gcTime: 10 * 60 * 1000, // 10분
	});
};
