import { useQuery, keepPreviousData } from '@tanstack/react-query';
import {
	GetAllVendorListPayload,
	GetSearchVendorListPayload,
	VendorSearchRequest,
} from '@primes/types/vendor';
import {
	getVendorList,
} from '@primes/services/init/vendorService';

export const useVendorListQuery = (
	params: GetAllVendorListPayload | GetSearchVendorListPayload
) => {
	// Extract parameters for the new API structure
	const { page = 0, size = 10 } = params;
		const searchRequest: VendorSearchRequest = 'searchRequest' in params
		? (params.searchRequest || {})
		: {};

	return useQuery({
		queryKey: ['vendor', page, size, searchRequest],
		queryFn: () => getVendorList({
			searchRequest,
			page,
			size,
		}),
		placeholderData: keepPreviousData,
		staleTime: 1000 * 60 * 3,
	});
};
