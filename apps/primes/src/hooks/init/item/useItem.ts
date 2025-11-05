import { useItemListQuery } from './useItemListQuery';
import { useCreateItem } from './useCreateItem';
import { useUpdateItem } from './useUpdateItem';
import { useDeleteItem } from './useDeleteItem';
import { SearchItemRequest, ItemListResponse } from '@primes/types/item';
import { UseQueryResult } from '@tanstack/react-query';

export const useItem = (params: {
	searchRequest?: SearchItemRequest;
	page: number;
	size: number;
}) => {
	const list: UseQueryResult<ItemListResponse, Error> =
		useItemListQuery(params);
	const create = useCreateItem();
	const update = useUpdateItem();
	const remove = useDeleteItem();

	return {
		list,
		create,
		update,
		remove,
	};
};
