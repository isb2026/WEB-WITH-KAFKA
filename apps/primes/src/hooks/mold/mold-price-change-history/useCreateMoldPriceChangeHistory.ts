import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createMoldPriceChangeHistory } from '@primes/services/mold/moldPriceChangeHistoryService';
import { MoldPriceChangeHistoryDto, MoldPriceChangeHistoryListCreateRequest } from '@primes/types/mold';
import { toast } from 'sonner';

export const useCreateMoldPriceChangeHistory = (page: number, size: number) => {
	const queryClient = useQueryClient();

	return useMutation<MoldPriceChangeHistoryDto[], Error, MoldPriceChangeHistoryListCreateRequest>({
		mutationFn: (data) => createMoldPriceChangeHistory(data),
		onSuccess: () => {
			toast.success('성공적으로 등록 되었습니다.');
			queryClient.invalidateQueries({
				queryKey: ['moldPriceChangeHistory', page, size],
			});
		},
		onError: (error) => {
			toast.error(error.message);
		},
	});
}; 