import { useQuery, keepPreviousData } from '@tanstack/react-query';
import { getProgressFieldName } from '@primes/services/init/progressService';

export const useProgressFieldQuery = (fieldName: string, enabled = true) => {
	return useQuery({
		queryKey: ['progress-field', fieldName],
		queryFn: () => getProgressFieldName(fieldName),
		enabled: !!fieldName && enabled,
		// placeholderData: keepPreviousData,
		staleTime: 1000 * 60 * 3,
	});
};
