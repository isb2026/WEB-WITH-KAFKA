import { useMutation, useQueryClient } from '@tanstack/react-query';
import { updateItem } from '@primes/services/init/itemService';
import { ItemUpdateRequest } from '@primes/types/item';
import { toast } from 'sonner';

type UpdateItemInput = { id: number; data: Partial<ItemUpdateRequest> };

export const useUpdateItem = () => {
	const queryClient = useQueryClient();

	return useMutation<any, Error, UpdateItemInput>({
		mutationFn: ({ id, data }) => updateItem(id, data),
		onSuccess: (_, { id }) => {
			toast.success('품목 수정이 완료되었습니다.');
			// CRITICAL FIX: Invalidate all item list queries to trigger re-render
			// This ensures the list updates when items are modified
			queryClient.invalidateQueries({
				queryKey: ['item'],
			});
			queryClient.invalidateQueries({
				queryKey: ['item-field'],
			});
		},
		onError: (error) => {
			toast.error(`수정 실패: ${error.message}`);
		},
	});
};

// Legacy version for backward compatibility
export const useUpdateItemLegacy = (page: number, size: number) => {
	const queryClient = useQueryClient();

	return useMutation<any, Error, UpdateItemInput>({
		mutationFn: ({ id, data }) => updateItem(id, data),
		onSuccess: () => {
			toast.success('품목 수정이 완료되었습니다.');
			queryClient.invalidateQueries({
				queryKey: ['item', page, size],
			});
		},
		onError: (error) => {
			toast.error(`수정 실패: ${error.message}`);
		},
	});
};
