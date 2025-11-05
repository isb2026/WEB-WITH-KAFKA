import { useQuery } from '@tanstack/react-query';
import { getProgressMachineList } from '@primes/services/machine/progressMachineService';
import { progressMachineKeys, type ProgressMachineListParams } from './keys';

export const useGetProgressMachineList = (
	params: ProgressMachineListParams
) => {
	const { page = 0, size = 10 } = params;
	const searchRequest = params.searchRequest || {};
	const progressId = searchRequest?.progressId ?? null;
	return useQuery({
		queryKey: progressMachineKeys.list(params),
		queryFn: () => {
			if (progressId == null) return { content: [], totalElements: 0 };
			return getProgressMachineList({
				searchRequest,
				page,
				size,
			});
		},
		placeholderData: (prev) => prev,
		staleTime: 1000 * 60 * 3,
	});
};
