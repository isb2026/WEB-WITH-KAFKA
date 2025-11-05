import { useMutation, useQueryClient } from '@tanstack/react-query';
import { deleteItemPriceHistory } from '@primes/services/purchase/itemPriceHistoryService';

type DeleteItemPriceHistoryInput = { id: number };

export const useDeleteItemPriceHistory = (page: number, size: number) => {
	const queryClient = useQueryClient();

	return useMutation<void, Error, DeleteItemPriceHistoryInput>({
		mutationFn: ({ id }) => deleteItemPriceHistory(id),
		onSuccess: () => {
			queryClient.invalidateQueries({
				queryKey: ['ItemPriceHistory', page, size],
			});
		},
	});
};
