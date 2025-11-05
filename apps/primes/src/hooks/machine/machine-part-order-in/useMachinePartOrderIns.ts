import { useCreateMachinePartOrderIn } from './useCreateMachinePartOrderIn';
import { useUpdateMachinePartOrderIn } from './useUpdateMachinePartOrderIn';
import { useDeleteMachinePartOrderIn } from './useDeleteMachinePartOrderIn';
import { useMachinePartOrderInListQuery } from './useMachinePartOrderInListQuery';
import { SearchMachinePartOrderInRequest } from '@primes/types/machine';

interface MachinePartOrderInParams {
	page?: number;
	size?: number;
	searchRequest?: SearchMachinePartOrderInRequest;
}

export const useMachinePartOrderIns = (params: MachinePartOrderInParams = {}) => {
	const list = useMachinePartOrderInListQuery(params);
	const create = useCreateMachinePartOrderIn();
	const update = useUpdateMachinePartOrderIn();
	const remove = useDeleteMachinePartOrderIn();

	return { list, create, update, remove };
};