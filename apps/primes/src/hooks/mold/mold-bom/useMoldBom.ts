import { useMoldBomListQuery } from './useMoldBomListQuery';
import { useCreateMoldBom } from './useCreateMoldBom';
import { useUpdateMoldBom } from './useUpdateMoldBom';
import { useDeleteMoldBom } from './useDeleteMoldBom';
import { MoldBomMasterSearchRequest } from '@primes/types/mold';

export const useMoldBom = (params: { 
	searchRequest?: MoldBomMasterSearchRequest;
	page: number; 
	size: number; 
}) => {
	const list = useMoldBomListQuery(params);
	const createMoldBom = useCreateMoldBom(params.page, params.size);
	const updateMoldBom = useUpdateMoldBom(params.page, params.size);
	const removeMoldBom = useDeleteMoldBom(params.page, params.size);

	return {
		list,
		createMoldBom,
		updateMoldBom,
		removeMoldBom,
	};
};
