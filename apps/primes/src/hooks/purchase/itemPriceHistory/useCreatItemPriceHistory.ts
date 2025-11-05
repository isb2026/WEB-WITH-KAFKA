import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createItemPriceHistory } from '@primes/services/purchase/itemPriceHistoryService';
import { CreateItemPriceHistoryPayload } from '@primes/types/purchase/itemPriceHistory';

type CreateItemPriceHistoryInput = {
	data: Partial<CreateItemPriceHistoryPayload>;
};

export const useCreateItemPriceHistory = (page: number, size: number) => {
	const queryClient = useQueryClient();

	return useMutation<void, Error, CreateItemPriceHistoryInput>({
		mutationFn: ({ data }) => createItemPriceHistory(data),
		onSuccess: () => {
			queryClient.invalidateQueries({
				queryKey: ['ItemPriceHistory', page, size],
			});
		},
	});
};
