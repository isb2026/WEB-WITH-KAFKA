import { useMutation, useQueryClient } from '@tanstack/react-query';
import {
	createNotworkDetail,
	createNotworkDetailBatch,
} from '@primes/services/production/notworkService';
import {
	CreateNotworkDetailPayload,
	CreateNotworkDetailBatchPayload,
} from '@primes/types/production/notwork';

/**
 * 비가동 Detail 생성 전용 Atomic Hook
 */
export const useCreateNotworkDetail = () => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: (data: CreateNotworkDetailPayload) =>
			createNotworkDetail(data),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ['notwork-detail'] });
			queryClient.invalidateQueries({
				queryKey: ['notwork-detail-fields'],
			});
		},
	});
};

/**
 * 비가동 Detail 배치 생성 전용 Atomic Hook
 */
export const useCreateNotworkDetailBatch = () => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: (data: CreateNotworkDetailBatchPayload) =>
			createNotworkDetailBatch(data),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ['notwork-detail'] });
			queryClient.invalidateQueries({
				queryKey: ['notwork-detail-fields'],
			});
		},
	});
};
