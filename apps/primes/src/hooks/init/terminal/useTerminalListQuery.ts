import { useQuery, keepPreviousData } from '@tanstack/react-query';
import { GetAllTerminalListPayload } from '@primes/types/terminal';
import { getAllTerminalList } from '@primes/services/init/terminalService';

export const useTerminalListQuery = (params: GetAllTerminalListPayload) => {
	return useQuery({
		queryKey: ['terminal', params.page, params.size, params.searchRequest],
		queryFn: () => getAllTerminalList({
			...params,
			searchRequest: params.searchRequest || {}
		}),
		placeholderData: keepPreviousData,
		staleTime: 1000 * 60 * 3,
	});
};
