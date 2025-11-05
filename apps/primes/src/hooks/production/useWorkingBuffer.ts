import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
	updateWorkingBuffer,
	getWorkingBufferList,
} from '@primes/services/production/workingBufferService';
import { WorkingBufferUpdateRequest } from '@primes/types/production';
import { toast } from 'sonner';

// WorkingBuffer 목록 조회
export const useWorkingBufferListQuery = (params: {
	searchRequest?: any;
	page?: number;
	size?: number;
}) => {
	return useQuery({
		queryKey: ['working-buffer', params],
		queryFn: () =>
			getWorkingBufferList(
				params.searchRequest,
				params.page,
				params.size
			),
	});
};

// 자재 회수 (WorkingBuffer 업데이트)
export const useUpdateWorkingBuffer = () => {
	const queryClient = useQueryClient();

	return useMutation<
		any[],
		Error,
		{ id: number; data: WorkingBufferUpdateRequest[] }
	>({
		mutationFn: ({ id, data }) => {
			return updateWorkingBuffer(id, data);
		},
		onSuccess: () => {
			toast.success('자재가 회수되었습니다.');

			// 관련 쿼리 무효화
			queryClient.invalidateQueries({
				queryKey: ['working-buffer'],
			});
			queryClient.invalidateQueries({
				queryKey: ['lot-master'],
			});
		},
		onError: (error) => {
			toast.error(`자재 회수 실패: ${error.message}`);
		},
	});
};

// WorkingBuffer 통합 훅
export const useWorkingBuffer = (params: {
	searchRequest?: any;
	page?: number;
	size?: number;
}) => {
	const list = useWorkingBufferListQuery(params);
	const update = useUpdateWorkingBuffer();

	return { list, update };
};
