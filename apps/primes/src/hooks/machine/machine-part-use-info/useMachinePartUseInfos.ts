import { useCreateMachinePartUseInfo } from './useCreateMachinePartUseInfo';
import { useUpdateMachinePartUseInfo } from './useUpdateMachinePartUseInfo';
import { useDeleteMachinePartUseInfo } from './useDeleteMachinePartUseInfo';
import { useMachinePartUseInfoListQuery } from './useMachinePartUseInfoListQuery';
import { SearchMachinePartUseInfoRequest } from '@primes/types/machine';

interface MachinePartUseInfoParams {
	page?: number;
	size?: number;
	searchRequest?: SearchMachinePartUseInfoRequest;
}

export const useMachinePartUseInfos = (params: MachinePartUseInfoParams = {}) => {
	const list = useMachinePartUseInfoListQuery(params);
	const create = useCreateMachinePartUseInfo();
	const update = useUpdateMachinePartUseInfo();
	const remove = useDeleteMachinePartUseInfo();

	return { list, create, update, remove };
};