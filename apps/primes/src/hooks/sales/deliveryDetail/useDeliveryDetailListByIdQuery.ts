import { useQuery, keepPreviousData } from '@tanstack/react-query';
import { getDeliveryDetailListById } from '@primes/services/sales/deliveryService';

export const useDeliveryDetailListByIdQuery = (params: {
	deliveryMasterId: number;
	page: number;
	size: number;
}) => {
	return useQuery({
		queryKey: [
			'deliveryDetail',
			params.deliveryMasterId,
			params.page,
			params.size,
		],
		queryFn: () =>
			getDeliveryDetailListById(
				params.deliveryMasterId,
				params.page,
				params.size
			),
		placeholderData: keepPreviousData,
		staleTime: 1000 * 60 * 3,
		enabled: !!params.deliveryMasterId, // Only run query if deliveryMasterId is provided
	});
};
