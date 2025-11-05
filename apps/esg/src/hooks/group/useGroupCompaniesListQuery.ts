import { getCompaniesByGroupId } from '@esg/services';
import { useQuery, keepPreviousData } from '@tanstack/react-query';

export const useGroupCompaniesListQuery = (groupId: number | null) => {
	return useQuery({
		queryKey: ['groupCompanies', groupId],
		queryFn: () => getCompaniesByGroupId(groupId!),
		placeholderData: keepPreviousData,
		staleTime: 1000 * 60 * 3,
		gcTime: 1000 * 60 * 3,
	});
};
