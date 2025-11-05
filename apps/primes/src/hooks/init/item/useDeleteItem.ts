import { useMutation, useQueryClient } from '@tanstack/react-query';
import { deleteItem } from '@primes/services/init/itemService';
import { toast } from 'sonner';

export const useDeleteItem = () => {
	const queryClient = useQueryClient();

	return useMutation<void, Error, number | number[]>({
		mutationFn: (ids) => {
			// Convert single ID to array for the new bulk delete API
			const idsArray = Array.isArray(ids) ? ids : [ids];
			return deleteItem(idsArray);
		},
		onSuccess: () => {
			toast.success('품목이 삭제되었습니다.');
			// Invalidate all item-related queries
			queryClient.invalidateQueries({
				queryKey: ['item'],
			});
			queryClient.invalidateQueries({
				queryKey: ['item-field'],
			});
		},
		onError: (error) => {
			toast.error(`삭제 실패: ${error.message}`);
		},
	});
};

// Legacy version for backward compatibility
export const useDeleteItemLegacy = (page: number, size: number) => {
	const queryClient = useQueryClient();

	return useMutation<void, Error, number>({
		mutationFn: (id) => deleteItem([id]),
		onSuccess: () => {
			toast.success('품목이 삭제되었습니다.');
			queryClient.invalidateQueries({
				queryKey: ['item', page, size],
			});
		},
		onError: (error) => {
			toast.error(`삭제 실패: ${error.message}`);
		},
	});
};
