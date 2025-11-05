import { useCreatePurchaseDetail } from './useCreatePurchaseDetail';
import { useUpdatePurchaseDetail } from './useUpdatePurchaseDetail';
import { useDeletePurchaseDetail } from './useDeletePurchaseDetail';
import {
	usePurchaseDetailListQuery,
	usePurchaseDetailListByMasterIdQuery,
} from './usePurchaseDetailListQuery';

export const usePurchaseDetail = (params: {
	page: number;
	size: number;
	purchaseMasterId?: number;
}) => {
	const list = usePurchaseDetailListQuery(params);
	const listByMasterId = usePurchaseDetailListByMasterIdQuery(
		params.purchaseMasterId || 0,
		params.page,
		params.size
	);
	const create = useCreatePurchaseDetail(params.page, params.size);
	const update = useUpdatePurchaseDetail(params.page, params.size);
	const remove = useDeletePurchaseDetail(params.page, params.size);

	return {
		list,
		listByMasterId,
		create,
		update,
		remove,
	};
}; 