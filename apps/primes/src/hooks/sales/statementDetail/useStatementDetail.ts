import { useCreateStatementDetail } from './useCreateStatementDetail';
import { useUpdateStatementDetail } from './useUpdateStatementDetail';
import { useDeleteStatementDetail } from './useDeleteStatementDetail';
import { useStatementDetailListQuery, useStatementDetailListByMasterIdQuery } from './useStatementDetailListQuery';

export const useStatementDetail = (params: { page: number; size: number; statementMasterId?: number }) => {
	const list = useStatementDetailListQuery(params);
	const listByMasterId = useStatementDetailListByMasterIdQuery(
		params.statementMasterId || 0,
		params.page,
		params.size
	);
	const create = useCreateStatementDetail(params.page, params.size);
	const update = useUpdateStatementDetail(params.page, params.size);
	const remove = useDeleteStatementDetail(params.page, params.size);

	return {
		list,
		listByMasterId,
		create,
		update,
		remove,
	};
}; 