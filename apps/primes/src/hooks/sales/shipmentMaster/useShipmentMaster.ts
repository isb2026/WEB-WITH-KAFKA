import { useCreateShipmentMaster } from './useCreateShipmentMaster';
import { useUpdateShipmentMaster } from './useUpdateShipmentMaster';
import { useDeleteShipmentMaster } from './useDeleteShipmentMaster';
import { useShipmentMasterListQuery } from './useShipmentMasterListQuery';

export const useShipmentMaster = (params: { page: number; size: number }) => {
	const list = useShipmentMasterListQuery(params);
	const create = useCreateShipmentMaster(params.page, params.size);
	const update = useUpdateShipmentMaster(params.page, params.size);
	const remove = useDeleteShipmentMaster(params.page, params.size);

	return {
		list,
		create,
		update,
		remove,
	};
};
