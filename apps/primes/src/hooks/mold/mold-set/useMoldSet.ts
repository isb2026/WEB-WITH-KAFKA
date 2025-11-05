import { useMoldSetListQuery } from './useMoldSetListQuery';
import { useCreateMoldSet } from './useCreateMoldSet';
import { useUpdateMoldSet } from './useUpdateMoldSet';
import { useDeleteMoldSet } from './useDeleteMoldSet';
import { MoldSetMasterSearchRequest } from '@primes/types/mold';

export const useMoldSet = (params: { 
	searchRequest?: MoldSetMasterSearchRequest;
	page: number; 
	size: number; 
}) => {
	const list = useMoldSetListQuery(params);
	const createMoldSet = useCreateMoldSet(params.page, params.size);
	const updateMoldSet = useUpdateMoldSet(params.page, params.size);
	const removeMoldSet = useDeleteMoldSet(params.page, params.size);

	return {
		list,
		createMoldSet,
		updateMoldSet,
		removeMoldSet,
	};
};