import { useQuery } from '@tanstack/react-query';
import { getMachinePartFields } from '@primes/services/machine/machinePartService';

export const useMachinePartFieldQuery = (fieldName: string, enabled = true) => {
	return useQuery({
		queryKey: ['MachinePart-field', fieldName],
		queryFn: () => getMachinePartFields(fieldName),
		enabled: !!fieldName && enabled,
		staleTime: 1000 * 60 * 3, // 3분간 캐시 유지
		gcTime: 1000 * 60 * 3, // 3분간 가비지 컬렉션
	});
};
