import { useMoldLifeChangeHistoryListQuery } from './useMoldLifeChangeHistoryListQuery';
import { useCreateMoldLifeChangeHistory } from './useCreateMoldLifeChangeHistory';
import { useUpdateMoldLifeChangeHistory } from './useUpdateMoldLifeChangeHistory';
import { useDeleteMoldLifeChangeHistory } from './useDeleteMoldLifeChangeHistory';
import { MoldLifeChangeHistorySearchRequest } from '@primes/types/mold';

export const useMoldLifeChangeHistory = (params: { 
	searchRequest?: MoldLifeChangeHistorySearchRequest;
	page: number; 
	size: number; 
}) => {
	const list = useMoldLifeChangeHistoryListQuery(params);
	const createMoldLifeChangeHistory = useCreateMoldLifeChangeHistory(params.page, params.size);
	const updateMoldLifeChangeHistory = useUpdateMoldLifeChangeHistory();
	const removeMoldLifeChangeHistory = useDeleteMoldLifeChangeHistory(params.page, params.size);

	return {
		list,
		createMoldLifeChangeHistory,
		updateMoldLifeChangeHistory,
		removeMoldLifeChangeHistory,
	};
}; 