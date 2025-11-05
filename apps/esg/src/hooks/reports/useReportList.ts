import { getReportList } from '@esg/services';
import { addDelay } from '@esg/utils/addDelay';
import { useQuery, keepPreviousData } from '@tanstack/react-query';

export const useReportList = (page: number, size: number) => {
	return useQuery({
		queryKey: ['report', page, size],
		queryFn: () => addDelay(1000, getReportList(page, size)),
		placeholderData: keepPreviousData,
		staleTime: 1000 * 60 * 3,
		gcTime: 1000 * 60 * 3,
	});
};
