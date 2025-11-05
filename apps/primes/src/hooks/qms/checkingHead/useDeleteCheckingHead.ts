import { useMutation, useQueryClient } from '@tanstack/react-query';
import { deleteCheckingHead } from '@primes/services/qms/checkingHeadService';

/**
 * QMS 검사 헤드 삭제 Hook (Atomic Pattern)
 * 단일 책임: 검사 헤드 삭제만 담당
 */
export const useDeleteCheckingHead = () => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: (ids: number[]) => deleteCheckingHead(ids),
		onSuccess: () => {
			// 관련 쿼리들 무효화
			queryClient.invalidateQueries({ queryKey: ['checking-heads'] });
			queryClient.invalidateQueries({
				queryKey: ['checking-head-fields'],
			});
		},
		onError: (error) => {
			console.error('QMS 검사 헤드 삭제 실패:', error);
		},
	});
};
