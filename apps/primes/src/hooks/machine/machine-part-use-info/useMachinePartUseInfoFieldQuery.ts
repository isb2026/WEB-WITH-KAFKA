import { useQuery } from '@tanstack/react-query';
import { getMachinePartUseInfoFields } from '@primes/services/machine/machinePartUseInfoService';

export const useMachinePartUseInfoFieldQuery = (fieldName: string, enabled = true) => {
	return useQuery({
		queryKey: ['MachinePartUseInfo-field', fieldName],
		queryFn: () => getMachinePartUseInfoFields(fieldName),
		enabled: !!fieldName && enabled,
		staleTime: 1000 * 60 * 3, // 3분간 캐시 유지
		gcTime: 1000 * 60 * 3, // 3분간 가비지 컬렉션
	});
};
