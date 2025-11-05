import { useQuery } from '@tanstack/react-query';
import { getMachineRepairById } from '@primes/services/machine/machineRepairService';

export const useMachineRepairByIdQuery = (id: number, enabled = true) => {
	return useQuery({
		queryKey: ['MachineRepair', id],
		queryFn: () => getMachineRepairById(id),
		enabled: enabled && !!id,
		staleTime: 1000 * 60 * 5, // 5분간 캐시 유지
	});
};
