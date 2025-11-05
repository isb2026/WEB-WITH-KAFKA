import { useMutation, useQueryClient } from '@tanstack/react-query';
import { deleteShippingRequestMaster } from '@primes/services/sales/shippingRequestMasterService';
import { toast } from 'sonner';

type DeleteShippingRequestMasterInput = { ids: number[] };

export const useDeleteShippingRequestMaster = (page: number, size: number) => {
	const queryClient = useQueryClient();

	return useMutation<void, Error, DeleteShippingRequestMasterInput>({
		mutationFn: ({ ids }) => deleteShippingRequestMaster(ids),
		onSuccess: () => {
			toast.success('배송 요청 마스터가 성공적으로 삭제되었습니다.');
			queryClient.invalidateQueries({
				queryKey: ['ShippingRequestMaster', page, size],
			});
		},
		onError: (error) => {
			toast.error(`배송 요청 마스터 삭제 실패: ${error.message}`);
		},
	});
};
