import { useQuery } from '@tanstack/react-query';
import { getShippingRequestDetailFieldName } from '@primes/services/sales/shippingRequestDetailService';

export const useShippingRequestDetailFieldQuery = (id: string) => {
	return useQuery({
		queryKey: ['ShippingRequestDetail', 'field', id],
		queryFn: () => getShippingRequestDetailFieldName(id),
	});
};
