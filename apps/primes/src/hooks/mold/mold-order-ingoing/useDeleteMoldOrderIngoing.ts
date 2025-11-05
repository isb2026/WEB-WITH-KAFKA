import { useMutation, useQueryClient } from '@tanstack/react-query';
import { deleteMoldOrderIngoing } from '@primes/services/mold/moldOrderIngoingService';
import { toast } from 'sonner';

export const useDeleteMoldOrderIngoing = (page: number, size: number) => {
	const queryClient = useQueryClient();

	return useMutation<any, Error, number[]>({
		mutationFn: (ids) => deleteMoldOrderIngoing(ids),
		onSuccess: () => {
			toast.success('성공적으로 삭제 되었습니다.');
			queryClient.invalidateQueries({
				queryKey: ['moldOrderIngoing', page, size],
			});
		},
		onError: (error) => {
			toast.error(error.message);
		},
	});
}; 