import { useMutation, useQueryClient } from '@tanstack/react-query';
import { deleteItemProgress } from '@primes/services/init/progressService';
import { toast } from 'sonner';
import { progressKeys } from './keys';

export const useDeleteProgress = () => {
	const queryClient = useQueryClient();

	return useMutation<void, Error, number | number[]>({
		mutationFn: (ids) => {
			// Convert single ID to array for the new bulk delete API
			const idsArray = Array.isArray(ids) ? ids : [ids];
			return deleteItemProgress(idsArray);
		},
		onSuccess: () => {
			toast.success('공정이 삭제되었습니다.');
			// progress 관련 모든 쿼리 무효화
			queryClient.invalidateQueries({
				queryKey: progressKeys.base,
			});
			// 다른 관련 쿼리들도 무효화
			queryClient.invalidateQueries({
				queryKey: ['item-progress'],
			});
			queryClient.invalidateQueries({
				queryKey: ['item-progress-field'],
			});
		},
		onError: (error) => {
			toast.error(`삭제 실패: ${error.message}`);
		},
	});
};

// Legacy version for backward compatibility
export const useDeleteProgressLegacy = (page: number, size: number) => {
	const queryClient = useQueryClient();

	return useMutation<void, Error, number>({
		mutationFn: (id: number) => deleteItemProgress([id]),
		onSuccess: () => {
			toast.success('공정이 삭제되었습니다.');
			queryClient.invalidateQueries({
				queryKey: ['progress', page, size],
			});
		},
		onError: (error) => {
			toast.error(`삭제 실패: ${error.message}`);
		},
	});
};
