import { useQuery, keepPreviousData } from '@tanstack/react-query';
import { getCompanyList } from '@esg/services/companyServices';
import { GetAllCompanyListPayload } from '@esg/types/company';

export const useCompanyListQuery = (params: GetAllCompanyListPayload) => {
	return useQuery({
		queryKey: [
			'company',
			'list',
			params.page,
			params.size,
			params.searchRequest,
		],
		queryFn: () => getCompanyList(params),
		placeholderData: keepPreviousData,
		staleTime: 1000 * 60 * 3,
		gcTime: 1000 * 60 * 3,
	});
};
