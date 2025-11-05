import { useQuery } from '@tanstack/react-query';
import { getProgressRouteFieldValues } from '@primes/services/init/progressRouteService';

export const useProgressRouteFieldQuery = (
	fieldName: string,
	enabled = true
) => {
	return useQuery({
		queryKey: ['ProgressRoute-field', fieldName],
		queryFn: () => getProgressRouteFieldValues(fieldName),
		enabled: !!fieldName && enabled,
		staleTime: 1000 * 60 * 3,
		gcTime: 1000 * 60 * 3,
	});
};
