import { useCreateItemPriceHistory } from './useCreatItemPriceHistory';
import { useUpdateItemPriceHistory } from './useUpdateItemPriceHistory';
import { useDeleteItemPriceHistory } from './useDeleteItemPriceHistory';
import { useItemPriceHistoryListQuery } from './useItemPriceHistoryListQuery';

export const useItemPriceHistory = (params: { page: number; size: number }) => {
	const list = useItemPriceHistoryListQuery(params);
	const create = useCreateItemPriceHistory(params.page, params.size);
	const update = useUpdateItemPriceHistory(params.page, params.size);
	const remove = useDeleteItemPriceHistory(params.page, params.size);

	return {
		list,
		create,
		update,
		remove,
	};
}; 