import { useOrderMasterListQuery } from './useOrderMasterListQuery';
import { useCreateOrderMaster } from './useCreateOrderMaster';
import { useUpdateOrderMaster } from './useUpdateOrderMaster';
import { useDeleteOrderMaster } from './useDeleteOrderMaster';
import { GetSearchOrderMasterListPayload } from '@primes/types/sales/orderMaster';

export const useOrderMaster = (params: GetSearchOrderMasterListPayload = { page: 0, size: 10, searchRequest: {} }) => {
	const list = useOrderMasterListQuery(params);
	const createMaster = useCreateOrderMaster(params.page, params.size);
	const updateMaster = useUpdateOrderMaster(params.page, params.size);
	const removeMaster = useDeleteOrderMaster();

	return {
		list,
		createMaster,
		updateMaster,
		removeMaster,
	};
};
