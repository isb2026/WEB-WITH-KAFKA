import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createEstimateDetail } from '@primes/services/sales/estimateDetailService';
import { CreateEstimateDetailPayload } from '@primes/types/sales/estimateDetail';
import { toast } from 'sonner';

type CreateEstimateDetailInput = any[]; // Changed from { data: Partial<CreateEstimateDetailPayload> }
export const useCreateEstimateDetail = () => {
	const queryClient = useQueryClient();

	return useMutation<void, Error, CreateEstimateDetailInput>({
		mutationFn: (data) => createEstimateDetail(data),
		onSuccess: () => {
			toast.success('성공적으로 등록 되었습니다.');
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
