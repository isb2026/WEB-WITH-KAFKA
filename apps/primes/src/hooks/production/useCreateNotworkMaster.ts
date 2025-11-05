import { useMutation, useQueryClient } from '@tanstack/react-query';
import {
	createNotworkMaster,
	createNotworkMasterBatch,
} from '@primes/services/production/notworkService';
import {
	CreateNotworkMasterPayload,
	CreateNotworkMasterBatchPayload,
} from '@primes/types/production/notwork';

/**
 * 비가동 Master 생성 전용 Atomic Hook
 */
export const useCreateNotworkMaster = () => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: (data: CreateNotworkMasterPayload) =>
			createNotworkMaster(data),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ['notwork-master'] });
			queryClient.invalidateQueries({
				queryKey: ['notwork-master-fields'],
			});
		},
	});
};

/**
 * 비가동 Master 배치 생성 전용 Atomic Hook
 */
export const useCreateNotworkMasterBatch = () => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: (data: CreateNotworkMasterBatchPayload) =>
			createNotworkMasterBatch(data),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ['notwork-master'] });
			queryClient.invalidateQueries({
				queryKey: ['notwork-master-fields'],
			});
		},
	});
};
