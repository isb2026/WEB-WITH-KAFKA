import { useCreateStatementMaster } from './useCreateStatementMaster';
import { useUpdateStatementMaster } from './useUpdateStatementMaster';
import { useDeleteStatementMaster } from './useDeleteStatementMaster';
import { useStatementMasterListQuery } from './useStatementMasterListQuery';

export const useStatementMaster = (params: { page: number; size: number }) => {
	const list = useStatementMasterListQuery(params);
	const create = useCreateStatementMaster(params.page, params.size);
	const update = useUpdateStatementMaster(params.page, params.size);
	const remove = useDeleteStatementMaster(params.page, params.size);

	return {
		list,
		create,
		update,
		remove,
	};
}; 