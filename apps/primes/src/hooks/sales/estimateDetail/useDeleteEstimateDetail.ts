import { useMutation, useQueryClient } from '@tanstack/react-query';
import { deleteEstimateDetail } from '@primes/services/sales/estimateDetailService';
import { toast } from 'sonner';

type DeleteEstimateDetailInput = { ids: number[] };

export const useDeleteEstimateDetail = (page: number, size: number) => {
	const queryClient = useQueryClient();

	return useMutation<void, Error, DeleteEstimateDetailInput>({
		mutationFn: ({ ids }) => deleteEstimateDetail(ids),
		onSuccess: () => {
			toast.success('성공적으로 삭제 되었습니다.');
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
