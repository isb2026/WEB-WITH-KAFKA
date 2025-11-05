import { useCreateMachineRepair } from './useCreateMachineRepair';
import { useUpdateMachineRepair } from './useUpdateMachineRepair';
import { useDeleteMachineRepair } from './useDeleteMachineRepair';
import { useMachineRepairListQuery } from './useMachineRepairListQuery';
import { SearchMachineRepairRequest } from '@primes/types/machine';

interface MachineRepairParams {
	page?: number;
	size?: number;
	searchRequest?: SearchMachineRepairRequest;
}

export const useMachineRepairs = (params: MachineRepairParams = {}) => {
	const list = useMachineRepairListQuery(params);
	const create = useCreateMachineRepair();
	const update = useUpdateMachineRepair();
	const remove = useDeleteMachineRepair();

	return { list, create, update, remove };
};