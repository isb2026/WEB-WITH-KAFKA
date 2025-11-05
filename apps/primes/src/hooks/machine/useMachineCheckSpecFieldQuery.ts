import { useQuery } from '@tanstack/react-query';
import { getMachineCheckSpecFields } from '@primes/services/machine/machineCheckSpecService';

export const useMachineCheckSpecFieldQuery = (
	fieldName: string,
	enabled = true
) => {
	return useQuery({
		queryKey: ['machine-check-spec-fields', fieldName],
		queryFn: () => getMachineCheckSpecFields(fieldName),
		enabled: !!fieldName && enabled,
		staleTime: 1000 * 60 * 3, // 3분 캐시
		gcTime: 1000 * 60 * 3, // 3분 가비지 컬렉션
	});
};
