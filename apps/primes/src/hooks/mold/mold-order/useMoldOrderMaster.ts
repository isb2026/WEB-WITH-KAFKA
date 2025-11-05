import { useMoldOrderMasterListQuery } from './useMoldOrderMasterListQuery';
import { useCreateMoldOrderMaster } from './useCreateMoldOrderMaster';
import { useUpdateMoldOrderMaster } from './useUpdateMoldOrderMaster';
import { useDeleteMoldOrderMaster } from './useDeleteMoldOrderMaster';
import { MoldOrderMasterSearchRequest } from '@primes/types/mold';

export const useMoldOrderMaster = (params: { 
	searchRequest?: MoldOrderMasterSearchRequest;
	page: number; 
	size: number; 
}) => {
	const list = useMoldOrderMasterListQuery(params);
	const createMoldOrderMaster = useCreateMoldOrderMaster(params.page, params.size);
	const updateMoldOrderMaster = useUpdateMoldOrderMaster();
	const removeMoldOrderMaster = useDeleteMoldOrderMaster(params.page, params.size);

	return {
		list,
		createMoldOrderMaster,
		updateMoldOrderMaster,
		removeMoldOrderMaster,
	};
}; 