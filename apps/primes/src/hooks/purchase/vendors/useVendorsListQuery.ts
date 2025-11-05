import { useQuery, keepPreviousData } from '@tanstack/react-query';
import {
	GetAllVendorsListPayload,
	GetSearchVendorsListPayload,
} from '@primes/types/purchase/vendors';
import {
	searchVendors,
	getAllVendorsList,
} from '@primes/services/purchase/vendorsService';

export const useVendorsListQuery = (
	params: GetAllVendorsListPayload | GetSearchVendorsListPayload
) => {
	const isSearching = 'searchRequest' in params;

	return useQuery({
		queryKey: isSearching
			? [
					'Vendors',
					'search',
					params.page,
					params.size,
					params.searchRequest,
				]
			: ['Vendors', params.page, params.size],
		queryFn: () =>
			isSearching
				? searchVendors(params as GetSearchVendorsListPayload)
				: getAllVendorsList(params as GetAllVendorsListPayload),
		placeholderData: keepPreviousData,
		staleTime: 1000 * 60 * 3,
		gcTime: 1000 * 60 * 3,
	});
};
