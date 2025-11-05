import { useQuery } from '@tanstack/react-query';
import { getEstimateMasterFieldName } from '@primes/services/sales/estimateMasterService';

export const useEstimateMasterFieldQuery = (
	fieldName: string,
	enabled = true
) => {
	return useQuery({
		queryKey: ['EstimateMaster-field', fieldName],
		queryFn: () => getEstimateMasterFieldName(fieldName),
		enabled: !!fieldName && enabled,
		staleTime: 1000 * 60 * 3,
		gcTime: 1000 * 60 * 3,
	});
};
