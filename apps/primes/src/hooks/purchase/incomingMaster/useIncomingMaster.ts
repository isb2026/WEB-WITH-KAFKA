import { useCreateIncomingMaster } from './useCreateIncomingMaster';
import { useUpdateIncomingMaster } from './useUpdateIncomingMaster';
import { useDeleteIncomingMaster } from './useDeleteIncomingMaster';
import { useIncomingMasterListQuery } from './useIncomingMasterListQuery';

export const useIncomingMaster = (params: { page: number; size: number }) => {
	const list = useIncomingMasterListQuery(params);
	const create = useCreateIncomingMaster(params.page, params.size);
	const update = useUpdateIncomingMaster(params.page, params.size);
	const remove = useDeleteIncomingMaster();

	return {
		list,
		create,
		update,
		remove,
	};
};
