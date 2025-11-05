import { useQuery } from '@tanstack/react-query';
import { getEstimateMasterById } from '@primes/services/sales/estimateMasterService';

export const useGetEstimateMasterById = (id: number, page: number = 0, size: number = 10) => {
	return useQuery({
		queryKey: ['EstimateMaster', 'byId', id, page, size],
		queryFn: () => getEstimateMasterById({ id, page, size }),
		enabled: id > 0,
		staleTime: 1000 * 60 * 3,
	});
}; 