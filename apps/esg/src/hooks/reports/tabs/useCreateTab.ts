import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createReportTab } from '@esg/services';
import { CreateTabPayload } from '@esg/types/report';

export const useCreateTab = (reportId: number) => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: (data: CreateTabPayload) => createReportTab(reportId, data),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ['report', reportId] });
		},
		onError: (error: Error) => {
			console.error('Failed to create tab:', error);
			alert(error.message);
		},
	});
};
