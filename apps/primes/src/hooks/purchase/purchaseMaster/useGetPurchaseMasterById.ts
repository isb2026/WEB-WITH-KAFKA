import { useQuery } from '@tanstack/react-query';
import { getPurchaseMasterById } from '@primes/services/purchase/purchaseMasterService';

export const useGetPurchaseMasterById = (
	id: number,
	page: number = 0,
	size: number = 10,
	enabled: boolean = true
) => {
	return useQuery({
		queryKey: ['PurchaseMaster', 'getById', id, page, size],
		queryFn: () => getPurchaseMasterById({ id, page, size }),
		enabled: enabled && !!id && id > 0,
		staleTime: 1000 * 60 * 5, // 5 minutes
	});
}; 