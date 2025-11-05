import { useDeliveryMasterListQuery } from './useDeliveryMasterListQuery';
import { useCreateDeliveryMaster } from './useCreateDeliveryMaster';
import { useUpdateDeliveryMaster } from './useUpdateDeliveryMaster';
import { useDeleteDeliveryMaster } from './useDeleteDeliveryMaster';
import { SearchDeliveryMasterRequest } from '@primes/types/sales/deliveryMaster';

export const useDeliveryMaster = (params: { page: number; size: number; searchRequest: SearchDeliveryMasterRequest }) => {
	const list = useDeliveryMasterListQuery(params);
	const create = useCreateDeliveryMaster(params.page, params.size);
	const update = useUpdateDeliveryMaster(params.page, params.size);
	const remove = useDeleteDeliveryMaster();

	return {
		list,
		create,
		update,
		remove,
	};
};
