import { useQuery } from '@tanstack/react-query';
import { getMachinePartUseInfoById } from '@primes/services/machine/machinePartUseInfoService';

export const useMachinePartUseInfoByIdQuery = (id: number, enabled = true) => {
	return useQuery({
		queryKey: ['MachinePartUseInfo', id],
		queryFn: () => getMachinePartUseInfoById(id),
		enabled: enabled && !!id,
		staleTime: 1000 * 60 * 5, // 5분간 캐시 유지
	});
};
