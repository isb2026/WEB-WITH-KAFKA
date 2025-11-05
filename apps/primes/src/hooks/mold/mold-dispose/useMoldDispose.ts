import { useMoldDisposeListQuery } from './useMoldDisposeListQuery';
import { useCreateMoldDispose } from './useCreateMoldDispose';
import { useUpdateMoldDispose } from './useUpdateMoldDispose';
import { useDeleteMoldDispose } from './useDeleteMoldDispose';
import { MoldDisposeSearchRequest } from '@primes/types/mold';

export const useMoldDispose = (params: { 
	searchRequest?: MoldDisposeSearchRequest;
	page: number; 
	size: number; 
}) => {
	const list = useMoldDisposeListQuery(params);
	const createMoldDispose = useCreateMoldDispose(params.page, params.size, params.searchRequest);
	const updateMoldDispose = useUpdateMoldDispose();
	const removeMoldDispose = useDeleteMoldDispose(params.page, params.size, params.searchRequest);

	return {
		list,
		createMoldDispose,
		updateMoldDispose,
		removeMoldDispose,
	};
}; 