import { useMutation, useQueryClient } from '@tanstack/react-query';
import { updateMoldLifeChangeHistory } from '@primes/services/mold/moldLifeChangeHistoryService';
import { MoldLifeChangeHistoryDto } from '@primes/types/mold';
import { toast } from 'sonner';

export const useUpdateMoldLifeChangeHistory = () => {
	const queryClient = useQueryClient();

	return useMutation<MoldLifeChangeHistoryDto, Error, { id: number; data: Partial<MoldLifeChangeHistoryDto> }>({
		mutationFn: ({ id, data }) => updateMoldLifeChangeHistory(id, data),
		onSuccess: (_, { id }) => {
			toast.success('성공적으로 수정 되었습니다.');
			queryClient.invalidateQueries({
				queryKey: ['moldLifeChangeHistory'],
			});
			queryClient.invalidateQueries({
				queryKey: ['moldLifeChangeHistory', id],
			});
		},
		onError: (error) => {
			toast.error(error.message);
		},
	});
}; 