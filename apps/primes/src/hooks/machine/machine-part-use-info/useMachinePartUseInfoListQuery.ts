import { useQuery, keepPreviousData } from '@tanstack/react-query';
import { getMachinePartUseInfoList } from '@primes/services/machine/machinePartUseInfoService';
import { SearchMachinePartUseInfoRequest } from '@primes/types/machine';

interface MachinePartUseInfoListParams {
	page?: number;
	size?: number;
	searchRequest?: SearchMachinePartUseInfoRequest;
}

export const useMachinePartUseInfoListQuery = (params: MachinePartUseInfoListParams = {}) => {
	const { page = 0, size = 10, searchRequest = {} } = params;

	return useQuery({
		queryKey: ['MachinePartUseInfo', page, size, searchRequest],
		queryFn: () => getMachinePartUseInfoList(searchRequest, page, size),
		placeholderData: keepPreviousData,
		staleTime: 1000 * 60 * 3, // 3분간 캐시 유지
	});
};
