import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
	createWorkingInLot,
	getWorkingInLotList,
	updateWorkingInLot,
	updateWorkingInLotAll,
	getWorkingInLotFieldValues,
	deleteWorkingInLot,
	getWorkingInLotGroupByItem,
} from '@primes/services/production/workingInLotService';
import type {
	WorkingInLotCreateRequest,
	WorkingInLotUpdateRequest,
	WorkingInLotSearchRequest,
	WorkingInLotUpdateAllRequest,
} from '@primes/types/production';
import { toast } from 'sonner';

// 자재 투입 목록 조회
export const useWorkingInLotListQuery = (params: {
	searchRequest?: WorkingInLotSearchRequest;
	page?: number;
	size?: number;
}) => {
	return useQuery({
		queryKey: ['working-in-lot', params],
		queryFn: () =>
			getWorkingInLotList(params.searchRequest, params.page, params.size),
	});
};

export const useWorkingInLotGroupByItemQuery = (params: {
	searchRequest?: WorkingInLotSearchRequest;
	page?: number;
	size?: number;
}) => {
	return useQuery({
		queryKey: ['working-in-lot-group-by-item', params],
		queryFn: () => getWorkingInLotGroupByItem(params.searchRequest, params.page, params.size),
	});
};

// 자재 투입 생성
export const useCreateWorkingInLot = () => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: (data: WorkingInLotCreateRequest[]) => {
			return createWorkingInLot(data);
		},
		onSuccess: () => {
			toast.success('자재가 투입되었습니다.');

			// 관련 쿼리 무효화
			queryClient.invalidateQueries({
				queryKey: ['working-in-lot'],
			});
			queryClient.invalidateQueries({
				queryKey: ['working-buffer'],
			});
		},
		onError: (error) => {
			toast.error(`자재 투입 실패: ${error.message}`);
		},
	});
};
//자재 투입 수정 훅
export const useUpdateWorkingInLot = () => {
	const queryClient = useQueryClient();

	return useMutation<any[], Error, WorkingInLotUpdateRequest[]>({
		mutationFn: (data) => {
			return updateWorkingInLot(data);
		},
		onSuccess: () => {
			toast.success('자재 투입이 수정되었습니다.');
			queryClient.invalidateQueries({
				queryKey: ['working-in-lot'],
			});
			queryClient.invalidateQueries({
				queryKey: ['working-buffer'],
			});
		},
		onError: (error) => {
			toast.error(`자재 투입 수정 실패: ${error.message}`);
		},
	});
};

// 자재 투입 삭제 훅
export const useDeleteWorkingInLot = () => {
	const queryClient = useQueryClient();

	return useMutation<void, Error, { ids: number[] }>({
		mutationFn: ({ ids }) => deleteWorkingInLot(ids),
		onSuccess: () => {
			toast.success('성공적으로 삭제 되었습니다.');
			queryClient.invalidateQueries({
				queryKey: ['working-in-lot'],
			});
			queryClient.invalidateQueries({
				queryKey: ['working-in-lot'],
			});
		},
		onError: (error) => {
			toast.error(error.message);
		},
	});
};

// 자재 투입 일괄 수정
export const useUpdateWorkingInLotAll = () => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: (data: WorkingInLotUpdateAllRequest) => {
			return updateWorkingInLotAll(data);
		},
		onSuccess: () => {
			toast.success('자재 투입 정보가 일괄 수정되었습니다.');

			// 관련 쿼리 무효화
			queryClient.invalidateQueries({
				queryKey: ['working-in-lot'],
			});
		},
		onError: (error) => {
			toast.error(`자재 투입 일괄 수정 실패: ${error.message}`);
		},
	});
};

// 자재 투입 필드 값 조회
export const useWorkingInLotFieldValuesQuery = (
	fieldName: string,
	searchRequest?: WorkingInLotSearchRequest
) => {
	return useQuery({
		queryKey: ['working-in-lot-field-values', fieldName, searchRequest],
		queryFn: () => getWorkingInLotFieldValues(fieldName, searchRequest),
		enabled: !!fieldName,
	});
};

// 자재 투입 통합 훅
export const useWorkingInLot = (params: {
	searchRequest?: WorkingInLotSearchRequest;
	page?: number;
	size?: number;
}) => {
	const list = useWorkingInLotListQuery(params);
	const create = useCreateWorkingInLot();
	const update = useUpdateWorkingInLot();
	const updateAll = useUpdateWorkingInLotAll();
	const remove = useDeleteWorkingInLot();
	const groupByItem = useWorkingInLotGroupByItemQuery(params);

	return { list, create, update, updateAll, remove, groupByItem };
};
