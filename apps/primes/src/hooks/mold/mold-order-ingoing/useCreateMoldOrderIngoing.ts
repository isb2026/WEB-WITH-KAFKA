import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createMoldOrderIngoing } from '@primes/services/mold/moldOrderIngoingService';
import { MoldOrderIngoingDto, MoldOrderIngoingListCreateRequest } from '@primes/types/mold';
import { toast } from 'sonner';

export const useCreateMoldOrderIngoing = (page: number, size: number) => {
	const queryClient = useQueryClient();

	return useMutation<MoldOrderIngoingDto[], Error, MoldOrderIngoingListCreateRequest>({
		mutationFn: (data) => createMoldOrderIngoing(data),
		onSuccess: () => {
			toast.success('성공적으로 등록 되었습니다.');
			queryClient.invalidateQueries({
				queryKey: ['moldOrderIngoing', page, size],
			});
		},
		onError: (error) => {
			toast.error(error.message);
		},
	});
}; 