import { useQuery, keepPreviousData } from '@tanstack/react-query';
import { getMachineList } from '@primes/services/machine/machineService';
import { SearchMachineRequest } from '@primes/types/machine';

interface MachineListParams {
	page?: number;
	size?: number;
	searchRequest?: SearchMachineRequest;
}

export const useMachineListQuery = (params: MachineListParams = {}) => {
	const { page = 0, size = 10, searchRequest = {} } = params;

	return useQuery({
		queryKey: ['Machine', page, size, searchRequest],
		queryFn: () => getMachineList({ searchRequest, page, size }),
		placeholderData: keepPreviousData,
		staleTime: 1000 * 60 * 3, // 3분간 캐시 유지
	});
};
