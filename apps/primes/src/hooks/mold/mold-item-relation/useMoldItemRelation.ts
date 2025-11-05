import { useMoldItemRelationListQuery } from './useMoldItemRelationListQuery';
import { useCreateMoldItemRelation } from './useCreateMoldItemRelation';
import { useUpdateMoldItemRelation } from './useUpdateMoldItemRelation';
import { useDeleteMoldItemRelation } from './useDeleteMoldItemRelation';
import { MoldItemRelationSearchRequest } from '@primes/types/mold';

export const useMoldItemRelation = (params: { 
	searchRequest?: MoldItemRelationSearchRequest;
	page: number; 
	size: number; 
}) => {
	const list = useMoldItemRelationListQuery(params);
	const createMoldItemRelation = useCreateMoldItemRelation(params.page, params.size);
	const updateMoldItemRelation = useUpdateMoldItemRelation();
	const removeMoldItemRelation = useDeleteMoldItemRelation(params.page, params.size);

	return {
		list,
		createMoldItemRelation,
		updateMoldItemRelation,
		removeMoldItemRelation,
	};
}; 