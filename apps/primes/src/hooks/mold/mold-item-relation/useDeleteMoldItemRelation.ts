import { useMutation, useQueryClient } from '@tanstack/react-query';
import { deleteMoldItemRelation } from '@primes/services/mold/moldItemRelationService';
import { toast } from 'sonner';

export const useDeleteMoldItemRelation = (page: number, size: number) => {
	const queryClient = useQueryClient();

	return useMutation<any, Error, number[]>({
		mutationFn: (ids) => deleteMoldItemRelation(ids),
		onSuccess: () => {
			toast.success('성공적으로 삭제 되었습니다.');
			// Invalidate all moldItemRelation queries to ensure proper refresh
			queryClient.invalidateQueries({
				queryKey: ['moldItemRelation'],
			});
		},
		onError: (error) => {
			toast.error(error.message);
		},
	});
};
