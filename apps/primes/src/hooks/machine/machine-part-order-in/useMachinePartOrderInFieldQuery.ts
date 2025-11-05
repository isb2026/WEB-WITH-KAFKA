import { useQuery } from '@tanstack/react-query';
import { getMachinePartOrderInFields } from '@primes/services/machine/machinePartOrderInService';

export const useMachinePartOrderInFieldQuery = (fieldName: string, enabled = true) => {
	return useQuery({
		queryKey: ['MachinePartOrderIn-field', fieldName],
		queryFn: () => getMachinePartOrderInFields(fieldName),
		enabled: !!fieldName && enabled,
		staleTime: 1000 * 60 * 3, // 3분간 캐시 유지
		gcTime: 1000 * 60 * 3, // 3분간 가비지 컬렉션
	});
};
