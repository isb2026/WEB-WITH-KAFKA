import { useQuery, keepPreviousData } from '@tanstack/react-query';
import { getDefectRecordList } from '@primes/services/production/defectRecordService';
import type { DefectRecordSearchRequest } from '@primes/types/production/defectTypes';

interface DefectRecordListParams {
	page?: number;
	size?: number;
	searchRequest?: DefectRecordSearchRequest;
}

export const useDefectRecordListQuery = (params: DefectRecordListParams = {}) => {
	const { page = 0, size = 10, searchRequest = {} } = params;

	return useQuery({
		queryKey: ['defectRecords', page, size, searchRequest],
		queryFn: () => getDefectRecordList(searchRequest, page, size),
		placeholderData: keepPreviousData,
		staleTime: 1000 * 60 * 3, // 3분
	});
}; 