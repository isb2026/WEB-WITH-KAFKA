import { useMutation, useQueryClient } from '@tanstack/react-query';
import { deleteReportTab } from '@esg/services';

export const useDeleteTab = (reportId: number) => {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: (tabId: number) => deleteReportTab(tabId, reportId),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ['report', reportId] });
		},
		onError: (error: Error) => {
			console.error('Failed to delete tab:', error);
			alert(error.message);
		},
	});
};
