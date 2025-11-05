import { useMoldPriceChangeHistoryListQuery } from './useMoldPriceChangeHistoryListQuery';
import { useCreateMoldPriceChangeHistory } from './useCreateMoldPriceChangeHistory';
import { useUpdateMoldPriceChangeHistory } from './useUpdateMoldPriceChangeHistory';
import { useDeleteMoldPriceChangeHistory } from './useDeleteMoldPriceChangeHistory';
import { MoldPriceChangeHistorySearchRequest } from '@primes/types/mold';

export const useMoldPriceChangeHistory = (params: { 
	searchRequest?: MoldPriceChangeHistorySearchRequest;
	page: number; 
	size: number; 
}) => {
	const list = useMoldPriceChangeHistoryListQuery(params);
	const createMoldPriceChangeHistory = useCreateMoldPriceChangeHistory(params.page, params.size);
	const updateMoldPriceChangeHistory = useUpdateMoldPriceChangeHistory();
	const removeMoldPriceChangeHistory = useDeleteMoldPriceChangeHistory(params.page, params.size);

	return {
		list,
		createMoldPriceChangeHistory,
		updateMoldPriceChangeHistory,
		removeMoldPriceChangeHistory,
	};
}; 