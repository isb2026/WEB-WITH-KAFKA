import { getAllCompaniesTreeData } from '@esg/services';
import { addDelay } from '@esg/utils/addDelay';
import { useQuery, keepPreviousData } from '@tanstack/react-query';

export const useCompanyTreeQuery = () => {
	return useQuery({
		queryKey: ['companyTree'],
		queryFn: () => addDelay(1000, getAllCompaniesTreeData()),
		placeholderData: keepPreviousData,
		staleTime: 1000 * 60 * 3,
		gcTime: 1000 * 60 * 3,
	});
};
