import { useQuery } from '@tanstack/react-query';
import { getMachineFieldName } from '@primes/services/machine/machineService';

export const useMachineFieldQuery = (fieldName: string, enabled = true) => {
	return useQuery({
		queryKey: ['Machine-field', fieldName],
		queryFn: () => getMachineFieldName(fieldName),
		enabled: !!fieldName && enabled,
		staleTime: 1000 * 60 * 3,
		gcTime: 1000 * 60 * 3,
	});
};
