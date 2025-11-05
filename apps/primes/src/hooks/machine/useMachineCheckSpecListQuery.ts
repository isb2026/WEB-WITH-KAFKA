import { useQuery, keepPreviousData } from '@tanstack/react-query';
import { getMachineCheckSpecList } from '@primes/services/machine/machineCheckSpecService';
import type { MachineCheckSpecListParams } from '@primes/types/machine/machineCheckSpec';

export const useMachineCheckSpecListQuery = (
	params: MachineCheckSpecListParams
) => {
	return useQuery({
		queryKey: ['machine-check-specs', params],
		queryFn: () => getMachineCheckSpecList(params),
		placeholderData: keepPreviousData,
		staleTime: 1000 * 60 * 5, // 5분간 캐시 유지
	});
};
