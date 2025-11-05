import { useQuery, keepPreviousData } from '@tanstack/react-query';
import {
	// getAllAccounts,
	// searchAccounts,
	getAllAccountStyle,
} from '@esg/services';
import {
	GetAllAccountStyleListPayload,
	SearchAccountStyleRequest,
} from '@esg/types/accountStyle';

interface AccountStyleListParms extends GetAllAccountStyleListPayload {
	searchRequest?: SearchAccountStyleRequest;
}

export const useAccountStyleListQuery = (params: AccountStyleListParms) => {
	return useQuery({
		queryKey: [
			'accountStyle',
			params.page,
			params.size,
			params?.searchRequest,
		],
		queryFn: () => getAllAccountStyle(params),
		placeholderData: keepPreviousData,
		staleTime: 1000 * 60 * 3,
		gcTime: 1000 * 60 * 3,
	});
};
