import { useMutation, useQueryClient } from '@tanstack/react-query';
import { deleteMoldDispose } from '@primes/services/mold/moldDisposeService';
import { toast } from 'sonner';

export const useDeleteMoldDispose = (page: number, size: number, searchRequest?: any) => {
	const queryClient = useQueryClient();

	return useMutation<any, Error, number[]>({
		mutationFn: (ids) => deleteMoldDispose(ids),
		onSuccess: () => {
			toast.success('성공적으로 삭제 되었습니다.');
			// Invalidate all moldDispose queries to ensure proper updates
			queryClient.invalidateQueries({
				queryKey: ['moldDispose'],
			});
		},
		onError: (error) => {
			toast.error(error.message);
		},
	});
}; 