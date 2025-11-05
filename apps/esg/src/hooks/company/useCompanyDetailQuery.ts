import { getDetailCompany } from '@esg/services';
import { useQuery, keepPreviousData } from '@tanstack/react-query';

export const useCompanyDetailQuery = (id: number) => {
	if (!id) return { data: null };
	return useQuery({
		queryKey: ['companyDetail', id],
		queryFn: () => getDetailCompany(id),
		placeholderData: keepPreviousData,
		staleTime: 1000 * 60 * 3,
		gcTime: 1000 * 60 * 3,
	});
};
