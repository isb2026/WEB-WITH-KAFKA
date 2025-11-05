import { useCreateShipmentDetail } from './useCreateShipmentDetail';
import { useUpdateShipmentDetail } from './useUpdateShipmentDetail';
import { useDeleteShipmentDetail } from './useDeleteShipmentDetail';
import { useShipmentDetailListByIdQuery } from './useShipmentDetailListByIdQuery';

export const useShipmentDetail = (params: {
	shipmentMasterId: number;
	page: number;
	size: number;
}) => {
	const listByMasterId = useShipmentDetailListByIdQuery(params);
	const create = useCreateShipmentDetail();
	const update = useUpdateShipmentDetail();
	const remove = useDeleteShipmentDetail();

	return {
		listByMasterId,
		create,
		update,
		remove,
	};
};
