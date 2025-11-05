import { useQuery } from '@tanstack/react-query';
import { getIncomingMasterById } from '@primes/services/purchase/incomingMasterService';

export const useGetIncomingMasterById = (
	id: number,
	page: number = 0,
	size: number = 10,
	enabled: boolean = true
) => {
	return useQuery({
		queryKey: ['IncomingMaster', 'getById', id, page, size],
		queryFn: () => getIncomingMasterById({ id, page, size }),
		enabled: enabled && !!id && id > 0,
		staleTime: 1000 * 60 * 5, // 5 minutes
	});
}; 