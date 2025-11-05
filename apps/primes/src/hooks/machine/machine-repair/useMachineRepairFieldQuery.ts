import { useQuery } from '@tanstack/react-query';
import { getMachineRepairFields } from '@primes/services/machine/machineRepairService';

export const useMachineRepairFieldQuery = (fieldName: string, enabled = true) => {
	return useQuery({
		queryKey: ['MachineRepair-field', fieldName],
		queryFn: () => getMachineRepairFields(fieldName),
		enabled: !!fieldName && enabled,
		staleTime: 1000 * 60 * 3, // 3분간 캐시 유지
		gcTime: 1000 * 60 * 3, // 3분간 가비지 컬렉션
	});
};
