import { useCreateVendors } from './useCreatVendors';
import { useUpdateVendors } from './useUpdateVendors';
import { useDeleteVendors } from './useDeletVendors';
import { useVendorsListQuery } from './useVendorsListQuery';

export const useVendors = (params: { page: number; size: number }) => {
	const list = useVendorsListQuery(params);
	const create = useCreateVendors(params.page, params.size);
	const update = useUpdateVendors(params.page, params.size);
	const remove = useDeleteVendors(params.page, params.size);

	return {
		list,
		create,
		update,
		remove,
	};
}; 