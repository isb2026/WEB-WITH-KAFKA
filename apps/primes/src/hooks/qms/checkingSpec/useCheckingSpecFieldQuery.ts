import { useQuery } from '@tanstack/react-query';
import { getCheckingSpecFieldName } from '@primes/services/qms/checkingSpecService';

export const useCheckingSpecFieldQuery = (
	fieldName: string,
	enabled = true
) => {
	return useQuery({
		queryKey: ['CheckingSpec-field', fieldName],
		queryFn: () => getCheckingSpecFieldName(fieldName),
		enabled: !!fieldName && enabled,
		staleTime: 1000 * 60 * 3,
		gcTime: 1000 * 60 * 3,
	});
};
