import { useMutation, useQueryClient } from '@tanstack/react-query';
import { deleteMoldInstance } from '@primes/services/mold/moldInstanceService';
import { toast } from 'sonner';

export const useDeleteMoldInstance = (page: number, size: number) => {
	const queryClient = useQueryClient();

	return useMutation<any, Error, number[]>({
		mutationFn: (ids) => deleteMoldInstance(ids),
		onSuccess: () => {
			toast.success('성공적으로 삭제 되었습니다.');
			// Invalidate all moldInstance queries to ensure list updates
			queryClient.invalidateQueries({
				queryKey: ['moldInstance'],
			});
		},
		onError: (error) => {
			toast.error(error.message);
		},
	});
};
