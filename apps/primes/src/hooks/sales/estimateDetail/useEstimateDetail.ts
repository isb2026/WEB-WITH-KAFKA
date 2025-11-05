import { useCreateEstimateDetail } from './useCreateEstimateDetail';
import { useUpdateEstimateDetail } from './useUpdateEstimateDetail';
import { useDeleteEstimateDetail } from './useDeleteEstimateDetail';
import {
	useEstimateDetailListQuery,
	useEstimateDetailListByMasterIdQuery,
} from './useEstimateDetailListQuery';

export const useEstimateDetail = (params: {
	page: number;
	size: number;
	estimateMasterId?: number;
}) => {
	const list = useEstimateDetailListQuery(params);
	const listByMasterId = useEstimateDetailListByMasterIdQuery(
		params.estimateMasterId || 0,
		params.page,
		params.size
	);
	const create = useCreateEstimateDetail();
	const update = useUpdateEstimateDetail(params.page, params.size);
	const remove = useDeleteEstimateDetail(params.page, params.size);

	return {
		list,
		listByMasterId,
		create,
		update,
		remove,
	};
};
