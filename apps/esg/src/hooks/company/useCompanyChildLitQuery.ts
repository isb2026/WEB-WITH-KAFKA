import { getChildCompanyList } from '@esg/services';
import { useQuery, keepPreviousData } from '@tanstack/react-query';

export const useCompanyChildListQuery = (id: number) => {
	return useQuery({
		queryKey: ['companyChild', id],
		queryFn: () => getChildCompanyList(id),
		placeholderData: keepPreviousData,
		staleTime: 1000 * 60 * 3,
		gcTime: 1000 * 60 * 3,
	});
};
