import { useQuery } from '@tanstack/react-query';
import { keepPreviousData } from '@tanstack/react-query';
import {
	getLotList, searchLotMasterWithConditions,
	updateLotAll,
} from '@primes/services/production/lotService';
import { LotListParams, LotSearchWithConditionsParams, UpdateLotAllPayload } from '@primes/types/production';
import { useCreateLot } from './useCreateLot';
import { useUpdateLot } from './useUpdateLot';
import { useDeleteLot } from './useDeleteLot';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';

import { useLots } from './lotMaster/useLots';
import { useLotListQuery } from './lotMaster/useLotListQuery';

// Lot 일괄 수정 훅
export const useUpdateLotAll = () => {
	const queryClient = useQueryClient();

	return useMutation<any[], Error, UpdateLotAllPayload[]>({
		mutationFn: (data) => {
			return updateLotAll(data);
		},
		onSuccess: () => {
			toast.success('LOT이 일괄 수정되었습니다.');

			// 관련 쿼리 무효화
			queryClient.invalidateQueries({
				queryKey: ['lots'],
			});
		},
		onError: (error) => {
			toast.error(`LOT 일괄 수정 실패: ${error.message}`);
		},
	});
};

// 새로운 조건부 검색 쿼리 훅
export const useLotSearchWithConditionsQuery = (params: LotSearchWithConditionsParams) => {
	return useQuery({
		queryKey: ['lots-search-conditions', params],
		queryFn: () =>
			searchLotMasterWithConditions(params.searchRequest, params.page, params.size),
		placeholderData: keepPreviousData,
		enabled: !!(params.searchRequest && (
			params.searchRequest.itemId || 
			params.searchRequest.commandId ||
			params.searchRequest.lotNo ||
			(params.searchRequest.conditions && Array.isArray(params.searchRequest.conditions) && params.searchRequest.conditions.length > 0)
		)), // 검색 조건이 있을 때만 실행
	});
};

export const useLot = (params: LotListParams) => {
	const list = useLotListQuery(params);
	const create = useCreateLot();
	const update = useUpdateLot();
	const updateAll = useUpdateLotAll();
	const remove = useDeleteLot();

	return { list, create, update, updateAll, remove };
};

// 조건부 검색을 포함한 통합 훅
export const useLotWithConditions = (params: LotSearchWithConditionsParams) => {
	const list = useLotSearchWithConditionsQuery(params);
	const create = useCreateLot();
	const update = useUpdateLot();
	const updateAll = useUpdateLotAll();
	const remove = useDeleteLot();

	return { list, create, update, updateAll, remove };
};

// Re-export from lotMaster
export { useLots } from './lotMaster/useLots';
export { useLotListQuery } from './lotMaster/useLotListQuery';
export { useLotFieldQuery } from './lotMaster/useLotFieldQuery';