import { useCreateMachine } from './useCreateMachine';
import { useUpdateMachine } from './useUpdateMachine';
import { useDeleteMachine } from './useDeleteMachine';
import { useMachineListQuery } from './useMachineListQuery';
import { SearchMachineRequest } from '@primes/types/machine';

interface MachineParams {
	page?: number;
	size?: number;
	searchRequest?: SearchMachineRequest;
}

export const useMachines = (params: MachineParams = {}) => {
	const list = useMachineListQuery(params);
	const create = useCreateMachine();
	const update = useUpdateMachine();
	const remove = useDeleteMachine();

	return { list, create, update, remove };
};