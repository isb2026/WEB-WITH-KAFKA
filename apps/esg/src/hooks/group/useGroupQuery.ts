import { getGroup } from '@esg/services';
import { useQuery, keepPreviousData } from '@tanstack/react-query';

export const useGroupQuery = (id: number) => {
	return useQuery({
		queryKey: ['group', id],
		queryFn: () => getGroup(id),
		placeholderData: keepPreviousData,
		staleTime: 1000 * 60 * 3,
		gcTime: 1000 * 60 * 3,
	});
};
