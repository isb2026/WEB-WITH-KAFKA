import { useMoldRepairListQuery } from './useMoldRepairListQuery';
import { useCreateMoldRepair } from './useCreateMoldRepair';
import { useUpdateMoldRepair } from './useUpdateMoldRepair';
import { useDeleteMoldRepair } from './useDeleteMoldRepair';
import { MoldRepairSearchRequest } from '@primes/types/mold';

export const useMoldRepair = (params: { 
	searchRequest?: MoldRepairSearchRequest;
	page: number; 
	size: number; 
}) => {
	const list = useMoldRepairListQuery(params);
	const createMoldRepair = useCreateMoldRepair(params.page, params.size);
	const updateMoldRepair = useUpdateMoldRepair();
	const removeMoldRepair = useDeleteMoldRepair(params.page, params.size);

	return {
		list,
		createMoldRepair,
		updateMoldRepair,
		removeMoldRepair,
	};
}; 