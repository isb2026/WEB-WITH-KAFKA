import { useQuery, keepPreviousData } from '@tanstack/react-query';
import {
	GetAllShipmentDetailListPayload,
	GetSearchShipmentDetailListPayload,
} from '@primes/types/sales/shipmentDetail';
import {
	getAllShipmentDetailList,
	searchShipmentDetail,
} from '@primes/services/sales/shipmentDetailService';

export const useShipmentDetailListQuery = (
	params: GetAllShipmentDetailListPayload | GetSearchShipmentDetailListPayload
) => {
	const isSearching = 'searchRequest' in params;

	return useQuery({
		queryKey: isSearching
			? [
					'ShipmentDetail',
					'search',
					params.page,
					params.size,
					params.searchRequest,
				]
			: ['ShipmentDetail', params.page, params.size],
		queryFn: () =>
			isSearching
				? searchShipmentDetail(
						params as GetSearchShipmentDetailListPayload
					)
				: getAllShipmentDetailList(
						params as GetAllShipmentDetailListPayload
					),
		placeholderData: keepPreviousData,
		staleTime: 1000 * 60 * 3,
		gcTime: 1000 * 60 * 3,
	});
};
