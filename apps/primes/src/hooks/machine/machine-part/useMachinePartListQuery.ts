import { useQuery, keepPreviousData } from '@tanstack/react-query';
import { getMachinePartList } from '@primes/services/machine/machinePartService';
import { SearchMachinePartRequest } from '@primes/types/machine';

interface MachinePartListParams {
	page?: number;
	size?: number;
	searchRequest?: SearchMachinePartRequest;
}

export const useMachinePartListQuery = (params: MachinePartListParams = {}) => {
	const { page = 0, size = 10, searchRequest = {} } = params;

	return useQuery({
		queryKey: ['MachinePart', page, size, searchRequest],
		queryFn: () => getMachinePartList(searchRequest, page, size),
		placeholderData: keepPreviousData,
		staleTime: 1000 * 60 * 3, // 3분간 캐시 유지
	});
};
