import { useQuery } from '@tanstack/react-query';
import { getReport } from '@esg/services';

export const useReportQuery = (reportId?: number) => {
	return useQuery({
		queryKey: ['report', reportId],
		queryFn: () => getReport(reportId!),
		enabled: !!reportId,
		staleTime: 1000 * 60 * 5,
		gcTime: 1000 * 60 * 10,
	});
};
