import { useQuery } from '@tanstack/react-query';
import { getMbomFieldName } from '@primes/services/init/mbomService';

export const useMbomFieldQuery = (fieldName: string, enabled = true) => {
	return useQuery({
		queryKey: ['Mbom-field', fieldName],
		queryFn: () => getMbomFieldName(fieldName),
		enabled: !!fieldName && enabled,
		staleTime: 1000 * 60 * 3,
		gcTime: 1000 * 60 * 3,
	});
};
