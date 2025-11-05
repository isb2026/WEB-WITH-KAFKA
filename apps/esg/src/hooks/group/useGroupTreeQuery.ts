import { getAllGroupsTreeData } from '@esg/services';
import { addDelay } from '@esg/utils/addDelay';
import { useQuery, keepPreviousData } from '@tanstack/react-query';

export const useGroupTreeQuery = () => {
	return useQuery({
		queryKey: ['group'],
		queryFn: () => addDelay(1000, getAllGroupsTreeData()),
		placeholderData: keepPreviousData,
		staleTime: 1000 * 60 * 3,
		gcTime: 1000 * 60 * 3,
	});
};
