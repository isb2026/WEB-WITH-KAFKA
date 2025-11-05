import { useQuery } from '@tanstack/react-query';
import { getMoldBomDetailSetAssignedInstances } from '@primes/services/mold/moldBomService';

export const useMoldBomDetailSetAssignedInstances = (
	moldBomMasterId: number | null
) => {
	return useQuery({
		queryKey: ['moldBomDetailSetAssignedInstances', moldBomMasterId],
		queryFn: () => getMoldBomDetailSetAssignedInstances(moldBomMasterId!),
		enabled: moldBomMasterId !== null && moldBomMasterId > 0,
		staleTime: 5 * 60 * 1000, // 5분
		gcTime: 10 * 60 * 1000, // 10분
	});
};
