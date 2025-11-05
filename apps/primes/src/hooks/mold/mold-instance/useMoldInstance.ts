import { useMoldInstanceListQuery } from './useMoldInstanceListQuery';
import { useCreateMoldInstance } from './useCreateMoldInstance';
import { useUpdateMoldInstance } from './useUpdateMoldInstance';
import { useDeleteMoldInstance } from './useDeleteMoldInstance';
import { MoldInstanceSearchRequest } from '@primes/types/mold';

export const useMoldInstance = (params: { 
	searchRequest?: MoldInstanceSearchRequest;
	page: number; 
	size: number; 
}) => {
	const list = useMoldInstanceListQuery(params);
	const createMoldInstance = useCreateMoldInstance(params.page, params.size);
	const updateMoldInstance = useUpdateMoldInstance();
	const removeMoldInstance = useDeleteMoldInstance(params.page, params.size);

	return {
		list,
		isLoading: list.isLoading,
		createMoldInstance,
		updateMoldInstance,
		removeMoldInstance,
	};
}; 