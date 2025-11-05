import { useQuery } from '@tanstack/react-query';
import { getChargerList } from '@esg/services/chargerService';
import { CompanyManager } from '@esg/types/company_manager';

export const useChargerListQuery = (
	companyId: string,
	page = 0,
	size = 100,
	searchRequest?: Partial<
		import('@esg/types/company_manager').GetAllCompanyManagerListPayload['searchRequest']
	>
) => {
	return useQuery<CompanyManager[], Error>({
		queryKey: ['chargerList', companyId, page, size, searchRequest],
		queryFn: () => getChargerList({ companyId, page, size, searchRequest }),
		enabled: !!companyId,
	});
};
