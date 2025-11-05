import { useMutation, useQueryClient } from '@tanstack/react-query';
import { updateReportTab } from '@esg/services';
import { UpdateTabPayload, UpdateTabData } from '@esg/types/report';

export const useUpdateTab = (reportId: number) => {
	const queryClient = useQueryClient();

	return useMutation<
		UpdateTabData,
		Error,
		{ tabId: number; data: UpdateTabPayload }
	>({
		mutationFn: ({ tabId, data }) => updateReportTab(reportId, tabId, data),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ['report', reportId] });
		},
		onError: (error: Error) => {
			console.error('Failed to update tab:', error);
		},
	});
};
