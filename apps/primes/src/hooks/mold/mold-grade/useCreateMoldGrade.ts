import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createMoldGrade } from '@primes/services/mold/moldGradeService';
import { MoldGradeDto, MoldGradeCreateRequest } from '@primes/types/mold';
import { toast } from 'sonner';

export const useCreateMoldGrade = (page: number, size: number) => {
	const queryClient = useQueryClient();

	return useMutation<MoldGradeDto, Error, MoldGradeCreateRequest>({
		mutationFn: (data) => createMoldGrade(data),
		onSuccess: () => {
			toast.success('성공적으로 등록 되었습니다.');
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
