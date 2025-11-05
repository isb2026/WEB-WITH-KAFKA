import { useQuery, keepPreviousData } from '@tanstack/react-query';
import { getMachinePartOrderInList } from '@primes/services/machine/machinePartOrderInService';
import { SearchMachinePartOrderInRequest } from '@primes/types/machine';

interface MachinePartOrderInListParams {
	page?: number;
	size?: number;
	searchRequest?: SearchMachinePartOrderInRequest;
}

export const useMachinePartOrderInListQuery = (params: MachinePartOrderInListParams = {}) => {
	const { page = 0, size = 10, searchRequest = {} } = params;

	return useQuery({
		queryKey: ['MachinePartOrderIn', page, size, searchRequest],
		queryFn: () => getMachinePartOrderInList(searchRequest, page, size),
		placeholderData: keepPreviousData,
		staleTime: 1000 * 60 * 3,
		gcTime: 1000 * 60 * 3,
	});
};
