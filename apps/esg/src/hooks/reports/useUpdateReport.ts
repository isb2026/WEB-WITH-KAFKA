import { useMutation, useQueryClient } from '@tanstack/react-query';
import { updateReport } from '@esg/services';
import { Report } from '@esg/types/report';

export const useUpdateReport = () => {
	const queryClient = useQueryClient();

	return useMutation<Report, Error, { id: number; data: Partial<Report> }>({
		mutationFn: ({ id, data }) => updateReport(id, data),
		onSuccess: () => {
			queryClient.invalidateQueries({
				predicate: (query) =>
					query.queryKey[0] === 'report' ||
					query.queryKey.includes('reportList'),
			});
		},
		onError: (error) => {
			throw new Error(`Failed to update report: ${error.message}`);
		},
	});
};
