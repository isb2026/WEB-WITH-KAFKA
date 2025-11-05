import { useQuery, keepPreviousData } from '@tanstack/react-query';
import { getItemList } from '@primes/services/init/itemService';
import type { ItemSearchRequest } from '@primes/types/item';

export const useItems = (params: {
	searchRequest?: ItemSearchRequest;
	page?: number;
	size?: number;
	enabled?: boolean;
}) => {
	return useQuery({
		queryKey: ['items', params.searchRequest, params.page, params.size],
		queryFn: () => getItemList({
			searchRequest: params.searchRequest || {},
			page: params.page || 0,
			size: params.size || 100, // 선택용이므로 많은 데이터를 가져옴
		}),
		placeholderData: keepPreviousData,
		staleTime: 1000 * 60 * 5, // 5분
		enabled: params.enabled !== false,
	});
}; 