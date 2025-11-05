import { useCreateMachinePartRelation } from './useCreateMachinePartRelation';
import { useUpdateMachinePartRelation } from './useUpdateMachinePartRelation';
import { useDeleteMachinePartRelation } from './useDeleteMachinePartRelation';
import { useMachinePartRelationListQuery } from './useMachinePartRelationListQuery';
import { SearchMachinePartRelationRequest } from '@primes/types/machine';

interface MachinePartRelationParams {
	page?: number;
	size?: number;
	searchRequest?: SearchMachinePartRelationRequest;
}

export const useMachinePartRelations = (params: MachinePartRelationParams = {}) => {
	const list = useMachinePartRelationListQuery(params);
	const create = useCreateMachinePartRelation();
	const update = useUpdateMachinePartRelation();
	const remove = useDeleteMachinePartRelation();

	return { list, create, update, remove };
};