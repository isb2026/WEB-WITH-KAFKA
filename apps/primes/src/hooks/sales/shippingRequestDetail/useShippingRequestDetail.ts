import { useCreateShippingRequestDetail } from './useCreateShippingRequestDetail';
import { useUpdateShippingRequestDetail } from './useUpdateShippingRequestDetail';
import { useDeleteShippingRequestDetail } from './useDeleteShippingRequestDetail';
import { useShippingRequestDetailListQuery } from './useShippingRequestDetailListQuery';
import { useShippingRequestDetailByMasterIdQuery } from './useShippingRequestDetailByMasterIdQuery';

export const useShippingRequestDetail = (params: {
	page: number;
	size: number;
	masterId?: number;
}) => {
	const list = useShippingRequestDetailListQuery(params);
	const listByMasterId = useShippingRequestDetailByMasterIdQuery({
		masterId: params.masterId,
		page: params.page,
		size: params.size,
	});
	const create = useCreateShippingRequestDetail();
	const update = useUpdateShippingRequestDetail();
	const remove = useDeleteShippingRequestDetail();

	return {
		list,
		listByMasterId,
		create,
		update,
		remove,
	};
};
