import { useMutation, useQueryClient } from '@tanstack/react-query';
import { updateMoldPriceChangeHistory } from '@primes/services/mold/moldPriceChangeHistoryService';
import { MoldPriceChangeHistoryDto } from '@primes/types/mold';
import { toast } from 'sonner';

export const useUpdateMoldPriceChangeHistory = () => {
	const queryClient = useQueryClient();

	return useMutation<MoldPriceChangeHistoryDto, Error, { id: number; data: Partial<MoldPriceChangeHistoryDto> }>({
		mutationFn: ({ id, data }) => updateMoldPriceChangeHistory(id, data),
		onSuccess: (_, { id }) => {
			toast.success('성공적으로 수정 되었습니다.');
			queryClient.invalidateQueries({
				queryKey: ['moldPriceChangeHistory'],
			});
			queryClient.invalidateQueries({
				queryKey: ['moldPriceChangeHistory', id],
			});
		},
		onError: (error) => {
			toast.error(error.message);
		},
	});
}; 