import { useQuery, keepPreviousData } from '@tanstack/react-query';
import { getMachineRepairList } from '@primes/services/machine/machineRepairService';
import { SearchMachineRepairRequest } from '@primes/types/machine';

interface MachineRepairListParams {
	page?: number;
	size?: number;
	searchRequest?: SearchMachineRepairRequest;
}

export const useMachineRepairListQuery = (params: MachineRepairListParams = {}) => {
	const { page = 0, size = 10, searchRequest = {} } = params;

	return useQuery({
		queryKey: ['MachineRepair', page, size, searchRequest],
		queryFn: () => getMachineRepairList(searchRequest, page, size),
		placeholderData: keepPreviousData,
		staleTime: 1000 * 60 * 3, // 3분간 캐시 유지
	});
};
