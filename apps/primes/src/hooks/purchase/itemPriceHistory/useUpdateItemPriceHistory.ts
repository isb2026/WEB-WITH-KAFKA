import { useMutation, useQueryClient } from '@tanstack/react-query';
import { updateItemPriceHistory } from '@primes/services/purchase/itemPriceHistoryService';
import { UpdateItemPriceHistoryPayload } from '@primes/types/purchase/itemPriceHistory';

type UpdateItemPriceHistoryInput = {
	id: number;
	data: Partial<UpdateItemPriceHistoryPayload>;
};

export const useUpdateItemPriceHistory = (page: number, size: number) => {
	const queryClient = useQueryClient();

	return useMutation<void, Error, UpdateItemPriceHistoryInput>({
		mutationFn: ({ id, data }) => updateItemPriceHistory(id, data),
		onSuccess: () => {
			queryClient.invalidateQueries({
				queryKey: ['ItemPriceHistory', 'list', { page, size }],
			});
		},
	});
};
