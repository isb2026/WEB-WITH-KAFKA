import { useQuery, keepPreviousData } from '@tanstack/react-query';
import { getAccountsByFilter } from '@esg/services';
import { GetAllAccountListPayload } from '@esg/types/account';

interface AccountListParms extends GetAllAccountListPayload {
	companyId?: number | null;
}

export const useAccountListQuery = (params: AccountListParms) => {
	const payload: GetAllAccountListPayload = {
		page: params.page,
		size: params.size,
		searchRequest: {
			...(params.searchRequest || {}),
			...(params.companyId ? { companyId: params.companyId } : {}),
		},
	};
	return useQuery({
		queryKey: [
			'accounts',
			payload.searchRequest,
			payload.page,
			payload.size,
		],
		queryFn: () => getAccountsByFilter(payload),
		placeholderData: keepPreviousData,
		staleTime: 1000 * 60 * 3,
		gcTime: 1000 * 60 * 3,
	});
};
