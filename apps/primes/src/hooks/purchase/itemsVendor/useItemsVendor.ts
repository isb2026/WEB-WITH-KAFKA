import { useCreateItemsVendor } from './useCreatItemsVendor';
import { useUpdateItemsVendor, useUpdateItemsVendorById } from './useUpdateItemsVendor';
import { useDeleteItemsVendor } from './useDeleteItemsVendor';
import { useItemsVendorListQuery } from './useItemsVendorListQuery';

export const useItemsVendor = (params: { page: number; size: number }) => {
	const list = useItemsVendorListQuery(params);
	const create = useCreateItemsVendor();
	const update = useUpdateItemsVendor();
	const updateById = useUpdateItemsVendorById();
	const remove = useDeleteItemsVendor();

	return {
		list,
		create,
		update,
		updateById,
		remove,
	};
};
