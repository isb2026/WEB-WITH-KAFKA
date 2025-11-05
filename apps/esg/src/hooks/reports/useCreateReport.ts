import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createReport } from '@esg/services';
import { useNavigate } from 'react-router-dom';
import { CreateReportPayload } from '@esg/types/report';

export const useCreateReport = () => {
	const queryClient = useQueryClient();
	const navigate = useNavigate();

	return useMutation({
		mutationFn: (data: CreateReportPayload) => createReport(data),
		onSuccess: (data) => {
			queryClient.invalidateQueries({ queryKey: ['report'] });
			navigate(`/report/${data?.reportId}`);
		},
		onError: (error: Error) => {
			console.error('Failed to create report:', error);
			alert(error.message);
		},
	});
};
