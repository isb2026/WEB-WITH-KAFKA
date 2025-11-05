import { useMutation, useQueryClient } from '@tanstack/react-query';
import { incomingService } from '@primes/services/incoming';

type CreateIncomingInput = {
	incomingCode: string;
	vendorNo: number;
	vendorName: string;
	incomingDate: string;
	currencyUnit: string;
};

export const useCreateIncoming = (page: number, size: number) => {
	const queryClient = useQueryClient();

	return useMutation<void, Error, CreateIncomingInput>({
		mutationFn: (data) => incomingService.createIncoming(data),
		onSuccess: () => {
			alert('입고가 성공적으로 생성되었습니다.');
			queryClient.invalidateQueries({
				queryKey: ['incoming', page, size],
			});
		},
		onError: (error) => {
			alert(error.message);
		},
	});
}; 