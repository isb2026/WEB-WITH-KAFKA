import { useQuery } from '@tanstack/react-query';
import { getMachinePartOrderFields } from '@primes/services/machine/machinePartOrderService';

export const useMachinePartOrderFieldQuery = (fieldName: string, enabled = true) => {
	return useQuery({
		queryKey: ['MachinePartOrder-field', fieldName],
		queryFn: () => getMachinePartOrderFields(fieldName),
		enabled: !!fieldName && enabled,
		staleTime: 1000 * 60 * 3, // 3분간 캐시 유지
		gcTime: 1000 * 60 * 3, // 3분간 가비지 컬렉션
	});
};
