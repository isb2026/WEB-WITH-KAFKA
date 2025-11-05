import { useMutation, useQueryClient } from '@tanstack/react-query';
import { deleteMoldLifeChangeHistory } from '@primes/services/mold/moldLifeChangeHistoryService';
import { toast } from 'sonner';

export const useDeleteMoldLifeChangeHistory = (page: number, size: number) => {
	const queryClient = useQueryClient();

	return useMutation<any, Error, number[]>({
		mutationFn: (ids) => deleteMoldLifeChangeHistory(ids),
		onSuccess: () => {
			toast.success('성공적으로 삭제 되었습니다.');
			queryClient.invalidateQueries({
				queryKey: ['moldLifeChangeHistory', page, size],
			});
		},
		onError: (error) => {
			toast.error(error.message);
		},
	});
}; 