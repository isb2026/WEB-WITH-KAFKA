import { useCreateMachinePartOrder } from './useCreateMachinePartOrder';
import { useUpdateMachinePartOrder } from './useUpdateMachinePartOrder';
import { useDeleteMachinePartOrder } from './useDeleteMachinePartOrder';
import { useMachinePartOrderListQuery } from './useMachinePartOrderListQuery';
import { SearchMachinePartOrderRequest } from '@primes/types/machine';

interface MachinePartOrderParams {
	page?: number;
	size?: number;
	searchRequest?: SearchMachinePartOrderRequest;
}

export const useMachinePartOrders = (params: MachinePartOrderParams = {}) => {
	const list = useMachinePartOrderListQuery(params);
	const create = useCreateMachinePartOrder();
	const update = useUpdateMachinePartOrder();
	const remove = useDeleteMachinePartOrder();

	return { list, create, update, remove };
};