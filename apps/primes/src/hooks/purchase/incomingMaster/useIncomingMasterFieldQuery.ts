import { useQuery } from '@tanstack/react-query';
import { getIncomingMasterFieldName } from '@primes/services/purchase/incomingMasterService';

export const useIncomingMasterFieldQuery = (
	fieldName: string,
	enabled = true
) => {
	return useQuery<string, Error, string>({
		queryKey: ['IncomingMaster-field', fieldName],
		queryFn: () => getIncomingMasterFieldName(fieldName),
		enabled: !!fieldName && enabled,
		staleTime: 1000 * 60 * 3,
		gcTime: 1000 * 60 * 3,
	});
};
