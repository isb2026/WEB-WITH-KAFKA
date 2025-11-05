import { useMutation, useQueryClient } from '@tanstack/react-query';
import { deleteMoldGrade } from '@primes/services/mold/moldGradeService';
import { toast } from 'sonner';

export const useDeleteMoldGrade = (page: number, size: number) => {
	const queryClient = useQueryClient();

	return useMutation<any, Error, number[]>({
		mutationFn: (ids) => deleteMoldGrade(ids),
		onSuccess: () => {
			toast.success('성공적으로 삭제 되었습니다.');
			// Invalidate all moldGrade queries to ensure list updates
			queryClient.invalidateQueries({
				queryKey: ['moldGrade'],
			});
		},
		onError: (error) => {
			toast.error(error.message);
		},
	});
};
