import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createPurchaseDetail } from '@primes/services/purchase/purchaseDetailService';
import { CreatePurchaseDetailPayload } from '@primes/types/purchase/purchaseDetail';
import { toast } from 'sonner';

type CreatePurchaseDetailInput = { 
	data: CreatePurchaseDetailPayload[] | { dataList: CreatePurchaseDetailPayload[] } 
};

export const useCreatePurchaseDetail = (page: number, size: number) => {
	const queryClient = useQueryClient();

	return useMutation<void, Error, CreatePurchaseDetailInput>({
		mutationFn: ({ data }) => createPurchaseDetail(data),
		onSuccess: () => {
			toast.success('성공적으로 등록 되었습니다.');
			// Invalidate all purchase detail related queries
			queryClient.invalidateQueries({
				queryKey: ['PurchaseDetail'],
			});
			// Also refetch all queries to ensure immediate UI update
			queryClient.refetchQueries({
				queryKey: ['PurchaseDetail'],
			});
		},
		onError: (error) => {
			toast.error(error.message);
		},
	});
};
