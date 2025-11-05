import { useCreateIncomingDetail } from './useCreateIncomingDetail';
import { useUpdateIncomingDetail } from './useUpdateIncomingDetail';
import { useUpdateAllIncomingDetail } from './useUpdateAllIncomingDetail';
import { useDeleteIncomingDetail } from './useDeleteIncomingDetail';
import {
	useIncomingDetailListQuery,
	useIncomingDetailListByMasterIdQuery,
} from './useIncomingDetailListQuery';

export const useIncomingDetail = (params: {
	page: number;
	size: number;
	incomingMasterId?: number;
}) => {
	const list = useIncomingDetailListQuery(params);
	const listByMasterId = useIncomingDetailListByMasterIdQuery(
		params.incomingMasterId || 0,
		params.page,
		params.size
	);
	const create = useCreateIncomingDetail(params.page, params.size);
	const update = useUpdateIncomingDetail(params.page, params.size);
	const updateAll = useUpdateAllIncomingDetail(params.page, params.size);
	const remove = useDeleteIncomingDetail(params.page, params.size);

	return {
		list,
		listByMasterId,
		create,
		update,
		updateAll,
		remove,
	};
}; 