import { useMutation, useQueryClient } from '@tanstack/react-query';
import { updateMoldDispose } from '@primes/services/mold/moldDisposeService';
import { MoldDisposeDto } from '@primes/types/mold';
import { toast } from 'sonner';

export const useUpdateMoldDispose = () => {
	const queryClient = useQueryClient();

	return useMutation<MoldDisposeDto, Error, { id: number; data: Partial<MoldDisposeDto> }>({
		mutationFn: ({ id, data }) => updateMoldDispose(id, data),
		onSuccess: (_, { id }) => {
			toast.success('성공적으로 수정 되었습니다.');
			queryClient.invalidateQueries({
				queryKey: ['moldDispose'],
			});
			queryClient.invalidateQueries({
				queryKey: ['moldDispose', id],
			});
		},
		onError: (error) => {
			toast.error(error.message);
		},
	});
}; 