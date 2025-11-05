import { useQuery, keepPreviousData } from '@tanstack/react-query';
import {
	GetAllShippingRequestMasterListPayload,
	GetSearchShippingRequestMasterListPayload,
} from '@primes/types/sales/shippingRequestMaster';
import {
	searchShippingRequestMaster,
	getAllShippingRequestMasterList,
} from '@primes/services/sales/shippingRequestMasterService';

export const useShippingRequestMasterListQuery = (
	params:
		| GetAllShippingRequestMasterListPayload
		| GetSearchShippingRequestMasterListPayload
) => {
	const isSearching = 'searchRequest' in params;

	return useQuery({
		queryKey: isSearching
			? [
					'ShippingRequestMaster',
					'search',
					params.page,
					params.size,
					params.searchRequest,
				]
			: ['ShippingRequestMaster', params.page, params.size],
		queryFn: () =>
			isSearching
				? searchShippingRequestMaster(
						params as GetSearchShippingRequestMasterListPayload
					)
				: getAllShippingRequestMasterList(
						params as GetAllShippingRequestMasterListPayload
					),
		placeholderData: keepPreviousData,
		staleTime: 1000 * 60 * 3,
		gcTime: 1000 * 60 * 3,
	});
};
