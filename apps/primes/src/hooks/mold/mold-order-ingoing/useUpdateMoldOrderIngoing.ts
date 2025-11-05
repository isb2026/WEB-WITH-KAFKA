import { useMutation, useQueryClient } from '@tanstack/react-query';
import { updateMoldOrderIngoing } from '@primes/services/mold/moldOrderIngoingService';
import { MoldOrderIngoingDto } from '@primes/types/mold';
import { toast } from 'sonner';

export const useUpdateMoldOrderIngoing = () => {
	const queryClient = useQueryClient();

	return useMutation<MoldOrderIngoingDto, Error, { id: number; data: Partial<MoldOrderIngoingDto> }>({
		mutationFn: ({ id, data }) => updateMoldOrderIngoing(id, data),
		onSuccess: (_, { id }) => {
			toast.success('성공적으로 수정 되었습니다.');
			queryClient.invalidateQueries({
				queryKey: ['moldOrderIngoing'],
			});
			queryClient.invalidateQueries({
				queryKey: ['moldOrderIngoing', id],
			});
		},
		onError: (error) => {
			toast.error(error.message);
		},
	});
}; 