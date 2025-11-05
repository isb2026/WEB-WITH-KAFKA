import { useOrderDetailListByIdQuery } from './useOrderDetailListByIdQuery';
import { useCreateOrderDetail } from './useCreateOrderDetail';
import { useUpdateOrderDetail } from './useUpdateOrderDetail';
import { useDeleteOrderDetail } from './useDeleteOrderDetail';

export const useOrderDetail = (params: {
	orderMasterId: number;
	page: number;
	size: number;
}) => {
	// Get details for a specific order if orderId is provided
	const listByMasterId = useOrderDetailListByIdQuery({
		orderMasterId: params.orderMasterId,
		page: params.page,
		size: params.size,
	});

	const createDetail = useCreateOrderDetail(
		params?.orderMasterId,
		params.page,
		params.size
	);
	const updateDetail = useUpdateOrderDetail(
		params.orderMasterId,
		params.page,
		params.size
	);
	const removeDetail = useDeleteOrderDetail(
		params.orderMasterId,
		params.page,
		params.size
	);

	return {
		listByMasterId,
		createDetail,
		updateDetail,
		removeDetail,
	};
};
