import { useQuery, keepPreviousData } from '@tanstack/react-query';
import { getCommandList } from '@primes/services/production/commandService';
import { CommandSearchRequest } from '@primes/types/production';

interface CommandListParams {
	page?: number;
	size?: number;
	searchRequest?: CommandSearchRequest;
	includeProductionProgress?: boolean;
}

export const useCommandListQuery = (params: CommandListParams = {}) => {
	const {
		page = 0,
		size = 10,
		searchRequest = {},
		includeProductionProgress = false,
	} = params;

	const {data, isLoading, error, refetch} = useQuery({
		queryKey: [
			'Command',
			page,
			size,
			searchRequest,
			includeProductionProgress,
		],
		queryFn: () =>
			getCommandList(
				searchRequest,
				page,
				size,
				includeProductionProgress
			),
		placeholderData: keepPreviousData,
		staleTime: 1000 * 60 * 3, // 3분간 캐시 유지
	});

	return {
		data,
		isLoading,
		error,
		refetch,
	};
};
