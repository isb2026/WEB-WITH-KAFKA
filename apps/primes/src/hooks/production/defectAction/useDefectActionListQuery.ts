import { useQuery, keepPreviousData } from '@tanstack/react-query';
import { getDefectActionList } from '@primes/services/production/defectActionService';
import type { DefectActionSearchRequest } from '@primes/types/production/defectTypes';

interface DefectActionListParams {
	page?: number;
	size?: number;
	searchRequest?: DefectActionSearchRequest;
}

export const useDefectActionListQuery = (params: DefectActionListParams = {}) => {
	const { page = 0, size = 10, searchRequest = {} } = params;

	return useQuery({
		queryKey: ['defectActions', page, size, searchRequest],
		queryFn: () => getDefectActionList(searchRequest, page, size),
		placeholderData: keepPreviousData,
		staleTime: 1000 * 60 * 3, // 3분
	});
}; 