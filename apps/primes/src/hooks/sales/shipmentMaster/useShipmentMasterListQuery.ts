import { useQuery, keepPreviousData } from '@tanstack/react-query';
import {
	GetAllShipmentListPayload,
	GetSearchShipmentMasterListPayload,
} from '@primes/types/sales/shipmentMaster';
import {
	searchShipmentMaster,
	getAllShipmentMasterList,
} from '@primes/services/sales/shipmentMasterService';

export const useShipmentMasterListQuery = (
	params: GetAllShipmentListPayload | GetSearchShipmentMasterListPayload
) => {
	const isSearching = 'searchRequest' in params;

	return useQuery({
		queryKey: isSearching
			? [
					'ShipmentMaster',
					'search',
					params.page,
					params.size,
					params.searchRequest,
				]
			: ['ShipmentMaster', params.page, params.size],
		queryFn: () =>
			isSearching
				? searchShipmentMaster(
						params as GetSearchShipmentMasterListPayload
					)
				: getAllShipmentMasterList(params as GetAllShipmentListPayload),
		placeholderData: keepPreviousData,
		staleTime: 1000 * 60 * 3,
		gcTime: 1000 * 60 * 3,
	});
};
