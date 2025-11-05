import { getAllRecords } from '@esg/services';
import { useQuery, keepPreviousData } from '@tanstack/react-query';
import { GetAllRecordListPayload } from '@esg/types/record';

interface RecordListParam extends GetAllRecordListPayload {}

export const useRecordListQuery = (params: RecordListParam) => {
	return useQuery({
		queryKey: [
			'records',
			params.page,
			params.size,
			params.searchRequest?.companyId,
			params.searchRequest?.accountId,
		],
		queryFn: () => getAllRecords(params),
		placeholderData: keepPreviousData,
		staleTime: 1000 * 60 * 3,
		gcTime: 1000 * 60 * 3,
	});
};
