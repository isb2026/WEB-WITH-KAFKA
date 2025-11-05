import { useQuery } from '@tanstack/react-query';
import { getEstimateDetailFieldName } from '@primes/services/sales/estimateDetailService';

export const useEstimateDetailFieldQuery = (
	fieldName: string,
	enabled = true
) => {
	return useQuery({
		queryKey: ['EstimateDetail-field', fieldName],
		queryFn: () => getEstimateDetailFieldName(fieldName),
		enabled: !!fieldName && enabled,
		staleTime: 1000 * 60 * 3,
		gcTime: 1000 * 60 * 3,
	});
};
