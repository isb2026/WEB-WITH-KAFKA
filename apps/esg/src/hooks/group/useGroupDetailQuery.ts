import { getGroupDetail } from '@esg/services';
import { useQuery, keepPreviousData } from '@tanstack/react-query';

export const useGroupDetailQuery = (id: number) => {
	return useQuery({
		queryKey: ['groupDetail', id],
		queryFn: () => getGroupDetail(id),
		placeholderData: keepPreviousData,
		staleTime: 1000 * 60 * 3,
		gcTime: 1000 * 60 * 3,
	});
};
