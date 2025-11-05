import { useQuery } from '@tanstack/react-query';
import { getMachineCheckSpecById } from '@primes/services/machine/machineCheckSpecService';

export const useMachineCheckSpecByIdQuery = (id: number, enabled = true) => {
	return useQuery({
		queryKey: ['machine-check-spec', id],
		queryFn: () => getMachineCheckSpecById(id),
		enabled: enabled && !!id,
		staleTime: 1000 * 60 * 5, // 5분간 캐시 유지
	});
};
