import { useMutation, useQueryClient } from '@tanstack/react-query';
import { updateMoldItemRelation } from '@primes/services/mold/moldItemRelationService';
import { MoldItemRelationDto } from '@primes/types/mold';
import { toast } from 'sonner';

export const useUpdateMoldItemRelation = () => {
	const queryClient = useQueryClient();

	return useMutation<MoldItemRelationDto, Error, { id: number; data: Partial<MoldItemRelationDto> }>({
		mutationFn: ({ id, data }) => updateMoldItemRelation(id, data),
		onSuccess: (_, { id }) => {
			toast.success('성공적으로 수정 되었습니다.');
			queryClient.invalidateQueries({
				queryKey: ['moldItemRelation'],
			});
			queryClient.invalidateQueries({
				queryKey: ['moldItemRelation', id],
			});
		},
		onError: (error) => {
			toast.error(error.message);
		},
	});
}; 