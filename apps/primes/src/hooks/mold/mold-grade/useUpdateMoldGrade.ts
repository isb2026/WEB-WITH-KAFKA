import { useMutation, useQueryClient } from '@tanstack/react-query';
import { updateMoldGrade } from '@primes/services/mold/moldGradeService';
import { MoldGradeDto } from '@primes/types/mold';
import { toast } from 'sonner';

export const useUpdateMoldGrade = () => {
	const queryClient = useQueryClient();

	return useMutation<MoldGradeDto, Error, { id: number; data: Partial<MoldGradeDto> }>({
		mutationFn: ({ id, data }) => updateMoldGrade(id, data),
		onSuccess: (_, { id }) => {
			toast.success('성공적으로 수정 되었습니다.');
			queryClient.invalidateQueries({
				queryKey: ['moldGrade'],
			});
			queryClient.invalidateQueries({
				queryKey: ['moldGrade', id],
			});
		},
		onError: (error) => {
			toast.error(error.message);
		},
	});
}; 