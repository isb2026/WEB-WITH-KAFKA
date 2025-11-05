import { useCreateEstimateMaster } from './useCreateEstimateMaster';
import { useUpdateEstimateMaster } from './useUpdateEstimateMaster';
import { useDeleteEstimateMaster } from './useDeleteEstimateMaster';
import { useEstimateMasterListQuery } from './useEstimateMasterListQuery';

export const useEstimateMaster = (params: { page: number; size: number }) => {
	const list = useEstimateMasterListQuery(params);
	const create = useCreateEstimateMaster(params.page, params.size);
	const update = useUpdateEstimateMaster(params.page, params.size);
	const remove = useDeleteEstimateMaster(params.page, params.size);

	return {
		list,
		create,
		update,
		remove,
	};
}; 