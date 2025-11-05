import { useMutation, useQueryClient } from '@tanstack/react-query';
import { deleteCheckingSample } from '@primes/services/qms/checkingSampleService';

/**
 * QMS 검사 샘플 삭제 Hook (Atomic Pattern)
 * 단일 책임: 검사 샘플 삭제만 담당
 */
export const useDeleteCheckingSample = () => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: (id: number) => deleteCheckingSample(id),
		onSuccess: () => {
			// 관련 쿼리들 무효화
			queryClient.invalidateQueries({ queryKey: ['checking-samples'] });
			queryClient.invalidateQueries({
				queryKey: ['checking-sample-fields'],
			});
		},
		onError: (error) => {
			console.error('QMS 검사 샘플 삭제 실패:', error);
		},
	});
};
