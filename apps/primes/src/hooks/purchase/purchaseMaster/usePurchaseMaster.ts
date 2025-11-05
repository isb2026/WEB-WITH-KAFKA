import { useCreatePurchaseMaster } from './useCreatePurchaseMaster';
import { useUpdatePurchaseMaster } from './useUpdatePurchaseMaster';
import { useDeletePurchaseMaster } from './useDeletePurchaseMaster';
import { usePurchaseMasterListQuery } from './usePurchaseMasterListQuery';

export const usePurchaseMaster = (params: { page: number; size: number }) => {
	const list = usePurchaseMasterListQuery(params);
	const create = useCreatePurchaseMaster();
	const update = useUpdatePurchaseMaster(params.page, params.size);
	const remove = useDeletePurchaseMaster(params.page, params.size);

	return {
		list,
		create,
		update,
		remove,
	};
};
