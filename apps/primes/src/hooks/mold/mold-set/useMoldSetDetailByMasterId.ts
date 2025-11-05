import { useQuery } from '@tanstack/react-query';
import { getMoldSetDetailByMasterId } from '@primes/services/mold/moldSetService';

export const useMoldSetDetailByMasterId = (
	masterId: number,
	page: number,
	size: number
) => {
	return useQuery({
		queryKey: ['moldSetDetail', masterId, page, size],
		queryFn: () => getMoldSetDetailByMasterId(masterId, page, size),
		enabled: masterId > 0,
		staleTime: 5 * 60 * 1000, // 5분
		gcTime: 10 * 60 * 1000, // 10분
	});
};