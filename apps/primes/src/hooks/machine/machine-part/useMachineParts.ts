import { useCreateMachinePart } from './useCreateMachinePart';
import { useUpdateMachinePart } from './useUpdateMachinePart';
import { useDeleteMachinePart } from './useDeleteMachinePart';
import { useMachinePartListQuery } from './useMachinePartListQuery';
import { SearchMachinePartRequest } from '@primes/types/machine';

interface MachinePartParams {
	page?: number;
	size?: number;
	searchRequest?: SearchMachinePartRequest;
}

export const useMachineParts = (params: MachinePartParams = {}) => {
	const list = useMachinePartListQuery(params);
	const create = useCreateMachinePart();
	const update = useUpdateMachinePart();
	const remove = useDeleteMachinePart();

	return { list, create, update, remove };
};