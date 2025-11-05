import { useMoldLocationListQuery } from './useMoldLocationListQuery';
import { useCreateMoldLocation } from './useCreateMoldLocation';
import { useUpdateMoldLocation } from './useUpdateMoldLocation';
import { useDeleteMoldLocation } from './useDeleteMoldLocation';
import { MoldLocationSearchRequest } from '@primes/types/mold';

export const useMoldLocation = (params: { 
	searchRequest?: MoldLocationSearchRequest;
	page: number; 
	size: number; 
}) => {
	const list = useMoldLocationListQuery(params);
	const createMoldLocation = useCreateMoldLocation(params.page, params.size);
	const updateMoldLocation = useUpdateMoldLocation();
	const removeMoldLocation = useDeleteMoldLocation(params.page, params.size);

	return {
		list,
		createMoldLocation,
		updateMoldLocation,
		removeMoldLocation,
	};
}; 