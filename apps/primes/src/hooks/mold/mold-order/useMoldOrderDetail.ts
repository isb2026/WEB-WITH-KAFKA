import { useMoldOrderDetailListQuery } from './useMoldOrderDetailListQuery';
import { useCreateMoldOrderDetail } from './useCreateMoldOrderDetail';
import { useUpdateMoldOrderDetail } from './useUpdateMoldOrderDetail';
import { useDeleteMoldOrderDetail } from './useDeleteMoldOrderDetail';
import { MoldOrderDetailSearchRequest } from '@primes/types/mold';

export const useMoldOrderDetail = (params: {
	searchRequest?: MoldOrderDetailSearchRequest;
	page: number;
	size: number;
}) => {
	const list = useMoldOrderDetailListQuery(params);
	const createMoldOrderDetail = useCreateMoldOrderDetail(params.page, params.size);
	const updateMoldOrderDetail = useUpdateMoldOrderDetail();
	const removeMoldOrderDetail = useDeleteMoldOrderDetail(params.page, params.size);

	return {
		list,
		createMoldOrderDetail,
		updateMoldOrderDetail,
		removeMoldOrderDetail,
	};
}; 