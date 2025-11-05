import { useQuery, keepPreviousData } from '@tanstack/react-query';
import { getDataRequestList } from '@esg/services/requestService';
import {
	GetAllDataRequestListPayload,
	DataRequestListResponse,
} from '@esg/types/request';

export const useDataRequestListQuery = (
	params: GetAllDataRequestListPayload
) => {
	return useQuery<DataRequestListResponse | null>({
		queryKey: [
			'data-request',
			'list',
			params.page,
			params.size,
			params.searchRequest,
		],
		queryFn: () => getDataRequestList(params),
		placeholderData: keepPreviousData,
		staleTime: 1000 * 60 * 3,
		gcTime: 1000 * 60 * 3,
	});
};
