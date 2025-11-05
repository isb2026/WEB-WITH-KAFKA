import { useMoldListQuery } from './useMoldListQuery';
import { useCreateMold } from './useCreateMold';
import { useUpdateMold } from './useUpdateMold';
import { useDeleteMold } from './useDeleteMold';
import { MoldMasterSearchRequest } from '@primes/types/mold';

export const useMold = (params: { 
	searchRequest?: MoldMasterSearchRequest;
	page: number; 
	size: number; 
}) => {
	const list = useMoldListQuery(params);
	const createMold = useCreateMold(params.page, params.size);
	const updateMold = useUpdateMold();
	const removeMold = useDeleteMold(params.page, params.size);

	return {
		list,
		createMold,
		updateMold,
		removeMold,
	};
}; 