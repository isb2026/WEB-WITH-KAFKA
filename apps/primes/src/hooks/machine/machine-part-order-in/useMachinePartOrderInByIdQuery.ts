import { useQuery } from '@tanstack/react-query';
import { getMachinePartOrderInById } from '@primes/services/machine/machinePartOrderInService';

export const useMachinePartOrderInByIdQuery = (id: number, enabled = true) => {
	return useQuery({
		queryKey: ['MachinePartOrderIn', id],
		queryFn: () => getMachinePartOrderInById(id),
		enabled: enabled && !!id,
		staleTime: 1000 * 60 * 5, // 5분간 캐시 유지
	});
};
