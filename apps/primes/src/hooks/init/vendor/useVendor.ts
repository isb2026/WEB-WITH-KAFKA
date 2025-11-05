import { useCreateVendor } from './useCreateVendor';
import { useUpdateVendor } from './useUpdateVendor';
import { useDeleteVendor } from './useDeleteVendor';
import { useVendorListQuery } from './useVendorListQuery';
import { GetAllVendorListPayload, GetSearchVendorListPayload } from '@primes/types/vendor';

// New atomic hook approach - recommended
export const useVendor = (params: GetAllVendorListPayload | GetSearchVendorListPayload) => {
	const list = useVendorListQuery(params);
	const create = useCreateVendor();
	const update = useUpdateVendor();
	const remove = useDeleteVendor();

	return {
		list,
		create,
		update,
		remove,
	};
};

// // Legacy version for backward compatibility
// export const useVendor = (params: { page: number; size: number }) => {
// 	const list = useVendorListQuery(params);
// 	const create = useCreateVendor();
// 	const update = useUpdateVendor();
// 	const remove = useDeleteVendor();

// 	return {
// 		list,
// 		create,
// 		update,
// 		remove,
// 	};
// };
