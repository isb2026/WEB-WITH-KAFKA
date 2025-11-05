import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createMoldLifeChangeHistory } from '@primes/services/mold/moldLifeChangeHistoryService';
import { MoldLifeChangeHistoryDto, MoldLifeChangeHistoryListCreateRequest } from '@primes/types/mold';
import { toast } from 'sonner';

export const useCreateMoldLifeChangeHistory = (page: number, size: number) => {
	const queryClient = useQueryClient();

	return useMutation<MoldLifeChangeHistoryDto[], Error, MoldLifeChangeHistoryListCreateRequest>({
		mutationFn: (data) => createMoldLifeChangeHistory(data),
		onSuccess: () => {
			toast.success('성공적으로 등록 되었습니다.');
			queryClient.invalidateQueries({
				queryKey: ['moldLifeChangeHistory'],
			});
		},
		onError: (error) => {
			toast.error(error.message);
		},
	});
}; 