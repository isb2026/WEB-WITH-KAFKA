import { useMoldOrderIngoingListQuery } from './useMoldOrderIngoingListQuery';
import { useCreateMoldOrderIngoing } from './useCreateMoldOrderIngoing';
import { useUpdateMoldOrderIngoing } from './useUpdateMoldOrderIngoing';
import { useDeleteMoldOrderIngoing } from './useDeleteMoldOrderIngoing';
import { useGetMoldOrderIngoingById } from './useGetMoldOrderIngoingById';
import { MoldOrderIngoingSearchRequest } from '@primes/types/mold';

export const useMoldOrderIngoing = (params: { 
	searchRequest?: MoldOrderIngoingSearchRequest;
	page: number; 
	size: number; 
}) => {
	const list = useMoldOrderIngoingListQuery(params);
	const createMoldOrderIngoing = useCreateMoldOrderIngoing(params.page, params.size);
	const updateMoldOrderIngoing = useUpdateMoldOrderIngoing();
	const removeMoldOrderIngoing = useDeleteMoldOrderIngoing(params.page, params.size);

	return {
		list,
		createMoldOrderIngoing,
		updateMoldOrderIngoing,
		removeMoldOrderIngoing,
	};
};

export { useGetMoldOrderIngoingById }; 