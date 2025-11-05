import { useQuery } from '@tanstack/react-query';
import { getMachinePartRelationById } from '@primes/services/machine/machinePartRelationService';

export const useMachinePartRelationByIdQuery = (id: number, enabled = true) => {
	return useQuery({
		queryKey: ['MachinePartRelation', id],
		queryFn: () => getMachinePartRelationById(id),
		enabled: enabled && !!id,
		staleTime: 1000 * 60 * 5, // 5분간 캐시 유지
	});
};
