import { useQuery, keepPreviousData } from '@tanstack/react-query';
import { getMachinePartRelationList } from '@primes/services/machine/machinePartRelationService';
import { SearchMachinePartRelationRequest } from '@primes/types/machine';

interface MachinePartRelationListParams {
	page?: number;
	size?: number;
	searchRequest?: SearchMachinePartRelationRequest;
}

export const useMachinePartRelationListQuery = (params: MachinePartRelationListParams = {}) => {
	const { page = 0, size = 10, searchRequest = {} } = params;

	return useQuery({
		queryKey: ['MachinePartRelation', page, size, searchRequest],
		queryFn: () => getMachinePartRelationList(searchRequest, page, size),
		placeholderData: keepPreviousData,
		staleTime: 1000 * 60 * 3, // 3분간 캐시 유지
	});
};
