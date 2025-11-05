import { useCreateDeliveryDetail } from './useCreateDeliveryDetail';
import { useUpdateDeliveryDetail } from './useUpdateDeliveryDetail';
import { useDeleteDeliveryDetail } from './useDeleteDeliveryDetail';
import { useDeliveryDetailListByIdQuery } from './useDeliveryDetailListByIdQuery';

export const useDeliveryDetail = (params: {
	deliveryMasterId: number;
	page: number;
	size: number;
}) => {
	const listByMasterId = useDeliveryDetailListByIdQuery(params);
	const create = useCreateDeliveryDetail(
		params.deliveryMasterId,
		params.page,
		params.size
	);
	const update = useUpdateDeliveryDetail(
		params.deliveryMasterId,
		params.page,
		params.size
	);
	const remove = useDeleteDeliveryDetail(
		params.deliveryMasterId,
		params.page,
		params.size
	);

	return {
		listByMasterId,
		create,
		update,
		remove,
	};
};
