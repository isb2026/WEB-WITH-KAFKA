import { useQuery, keepPreviousData } from '@tanstack/react-query';
import {
	GetAllShippingRequestDetailListPayload,
	GetSearchShippingRequestDetailListPayload,
} from '@primes/types/sales/shippingRequestDetail';
import {
	searchShippingRequestDetail,
	getAllShippingRequestDetailList,
} from '@primes/services/sales/shippingRequestDetailService';

export const useShippingRequestDetailListQuery = (
	params:
		| GetAllShippingRequestDetailListPayload
		| GetSearchShippingRequestDetailListPayload
) => {
	const isSearching = 'searchRequest' in params;

	return useQuery({
		queryKey: isSearching
			? [
					'ShippingRequestDetail',
					'search',
					params.page,
					params.size,
					params.searchRequest,
				]
			: ['ShippingRequestDetail', params.page, params.size],
		queryFn: () =>
			isSearching
				? searchShippingRequestDetail(
						params as GetSearchShippingRequestDetailListPayload
					)
				: getAllShippingRequestDetailList(),
		placeholderData: keepPreviousData,
		staleTime: 1000 * 60 * 3,
		gcTime: 1000 * 60 * 3,
	});
};
