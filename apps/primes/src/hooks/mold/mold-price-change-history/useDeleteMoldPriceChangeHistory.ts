import { useMutation, useQueryClient } from '@tanstack/react-query';
import { deleteMoldPriceChangeHistory } from '@primes/services/mold/moldPriceChangeHistoryService';
import { toast } from 'sonner';

export const useDeleteMoldPriceChangeHistory = (page: number, size: number) => {
	const queryClient = useQueryClient();

	return useMutation<any, Error, number[]>({
		mutationFn: (ids) => deleteMoldPriceChangeHistory(ids),
		onSuccess: () => {
			toast.success('성공적으로 삭제 되었습니다.');
			queryClient.invalidateQueries({
				queryKey: ['moldPriceChangeHistory', page, size],
			});
		},
		onError: (error) => {
			toast.error(error.message);
		},
	});
}; 