import { useQuery } from '@tanstack/react-query';
import { getMachinePartOrderById } from '@primes/services/machine/machinePartOrderService';

export const useMachinePartOrderByIdQuery = (id: number, enabled = true) => {
	return useQuery({
		queryKey: ['MachinePartOrder', id],
		queryFn: () => getMachinePartOrderById(id),
		enabled: enabled && !!id,
		staleTime: 1000 * 60 * 5, // 5분간 캐시 유지
	});
};
