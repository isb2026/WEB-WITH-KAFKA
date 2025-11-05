import { useMutation, useQueryClient } from '@tanstack/react-query';
import { incomingService } from '@primes/services/incoming';

type DeleteIncomingInput = { id: number };

export const useDeleteIncoming = (page: number, size: number) => {
	const queryClient = useQueryClient();

	return useMutation<void, Error, DeleteIncomingInput>({
		mutationFn: ({ id }) => incomingService.deleteIncoming(id),
		onSuccess: () => {
			alert('입고가 성공적으로 삭제되었습니다.');
			queryClient.invalidateQueries({
				queryKey: ['incoming', page, size],
			});
		},
		onError: (error) => {
			alert(error.message);
		},
	});
}; 