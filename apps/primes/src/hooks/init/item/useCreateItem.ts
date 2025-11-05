import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createItem } from '@primes/services/init/itemService';
import { ItemCreateRequest } from '@primes/types/item';
import { toast } from 'sonner';

export const useCreateItem = () => {
	const queryClient = useQueryClient();

	return useMutation<any, Error, Partial<ItemCreateRequest>>({
		mutationFn: (data) => createItem(data),
		onSuccess: () => {
			toast.success('품목이 생성되었습니다.');
			// CRITICAL FIX: Invalidate all item list queries to trigger re-render
			// This ensures the list updates when new items are created
			queryClient.invalidateQueries({
				queryKey: ['item'],
			});
			queryClient.invalidateQueries({
				queryKey: ['item-field'],
			});
		},
		onError: (error) => {
			toast.error(`생성 실패: ${error.message}`);
		},
	});
};

// Legacy version for backward compatibility
export const useCreateItemLegacy = (page: number, size: number) => {
	const queryClient = useQueryClient();

	return useMutation<any, Error, { data: Partial<ItemCreateRequest> }>({
		mutationFn: ({ data }) => createItem(data),
		onSuccess: () => {
			toast.success('품목이 생성되었습니다.');
			queryClient.invalidateQueries({
				queryKey: ['item', page, size],
			});
		},
		onError: (error) => {
			toast.error(`생성 실패: ${error.message}`);
		},
	});
};
