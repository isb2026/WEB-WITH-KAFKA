import { useMutation, useQueryClient } from '@tanstack/react-query';
import { deleteReport } from '@esg/services';

export const useDeleteReport = () => {
	const queryClient = useQueryClient();

	return useMutation<void, Error, number>({
		mutationFn: (id) => deleteReport(id),
		onSuccess: () => {
			queryClient.invalidateQueries({
				predicate: (query) =>
					query.queryKey[0] === 'report' ||
					query.queryKey.includes('reportList'),
			});
		},
		onError: (error) => {
			throw new Error(`Failed to delete report: ${error.message}`);
		},
	});
};
