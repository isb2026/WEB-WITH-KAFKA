import { useCreateShippingRequestMaster } from './useCreateShippingRequestMaster';
import { useUpdateShippingRequestMaster } from './useUpdateShippingRequestMaster';
import { useDeleteShippingRequestMaster } from './useDeleteShippingRequestMaster';
import { useShippingRequestMasterListQuery } from './useShippingRequestMasterListQuery';

export const useShippingRequestMaster = (params: { page: number; size: number }) => {
	const list = useShippingRequestMasterListQuery(params);
	const create = useCreateShippingRequestMaster(params.page, params.size);
	const update = useUpdateShippingRequestMaster(params.page, params.size);
	const remove = useDeleteShippingRequestMaster(params.page, params.size);

	return {
		list,
		create,
		update,
		remove,
	};
}; 