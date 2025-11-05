import { useMutation, useQueryClient } from '@tanstack/react-query';
import { updateEstimateDetail } from '@primes/services/sales/estimateDetailService';
import { UpdateEstimateDetailPayload } from '@primes/types/sales/estimateDetail';
import { toast } from 'sonner';

type UpdateEstimateDetailInput = {
	id: number;
	data: Partial<UpdateEstimateDetailPayload>;
};

export const useUpdateEstimateDetail = (page: number, size: number) => {
	const queryClient = useQueryClient();

	return useMutation<void, Error, UpdateEstimateDetailInput>({
		mutationFn: ({ id, data }) => updateEstimateDetail(id, data),
		onSuccess: () => {
			toast.success('성공적으로 수정 되었습니다.');
			// Invalidate both the general list and byMasterId queries
			queryClient.invalidateQueries({
				queryKey: ['EstimateDetail'],
			});
			queryClient.invalidateQueries({
				queryKey: ['EstimateDetail', 'byMasterId'],
			});
		},
		onError: (error) => {
			toast.error(error.message);
		},
	});
};
