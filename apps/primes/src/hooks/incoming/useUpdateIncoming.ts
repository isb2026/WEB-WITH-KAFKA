import { useMutation, useQueryClient } from '@tanstack/react-query';
import { incomingService } from '@primes/services/incoming';

type UpdateIncomingInput = {
	id: number;
	data: Partial<{
		incomingCode: string;
		vendorNo: number;
		vendorName: string;
		incomingDate: string;
		currencyUnit: string;
	}>;
};

export const useUpdateIncoming = (page: number, size: number) => {
	const queryClient = useQueryClient();

	return useMutation<void, Error, UpdateIncomingInput>({
		mutationFn: ({ id, data }) => incomingService.updateIncoming({ id, data }),
		onSuccess: () => {
			alert('입고가 성공적으로 수정되었습니다.');
			queryClient.invalidateQueries({
				queryKey: ['incoming', page, size],
			});
		},
		onError: (error) => {
			alert(error.message);
		},
	});
}; 