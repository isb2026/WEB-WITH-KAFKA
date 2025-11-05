import { useQuery } from '@tanstack/react-query';
import { getMachinePartById } from '@primes/services/machine/machinePartService';

export const useMachinePartByIdQuery = (id: number, enabled = true) => {
	return useQuery({
		queryKey: ['MachinePart', id],
		queryFn: () => getMachinePartById(id),
		enabled: enabled && !!id,
		staleTime: 1000 * 60 * 5, // 5분간 캐시 유지
	});
};
