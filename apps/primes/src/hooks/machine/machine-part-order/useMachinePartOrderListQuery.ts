import { useQuery, keepPreviousData } from '@tanstack/react-query';
import { getMachinePartOrderList } from '@primes/services/machine/machinePartOrderService';
import { SearchMachinePartOrderRequest } from '@primes/types/machine';

interface MachinePartOrderListParams {
	page?: number;
	size?: number;
	searchRequest?: SearchMachinePartOrderRequest;
}

export const useMachinePartOrderListQuery = (params: MachinePartOrderListParams = {}) => {
	const { page = 0, size = 10, searchRequest = {} } = params;

	return useQuery({
		queryKey: ['MachinePartOrder', page, size, searchRequest],
		queryFn: () => getMachinePartOrderList(searchRequest, page, size),
		placeholderData: keepPreviousData,
		staleTime: 1000 * 60 * 3,
		gcTime: 1000 * 60 * 3,
	});
};
