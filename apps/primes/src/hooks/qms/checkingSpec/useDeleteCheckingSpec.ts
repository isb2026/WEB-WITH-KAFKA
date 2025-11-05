import { useMutation, useQueryClient } from '@tanstack/react-query';
import { deleteCheckingSpec } from '@primes/services/qms/checkingSpecService';

/**
 * QMS 검사 규격 삭제 Hook (Atomic Pattern)
 * 단일 책임: 검사 규격 삭제만 담당
 */
export const useDeleteCheckingSpec = () => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: (ids: number[]) => deleteCheckingSpec(ids),
		onSuccess: () => {
			// 관련 쿼리들 무효화
			queryClient.invalidateQueries({ queryKey: ['checking-specs'] });
			queryClient.invalidateQueries({
				queryKey: ['checking-spec-fields'],
			});
		},
		onError: (error) => {
			console.error('QMS 검사 규격 삭제 실패:', error);
		},
	});
};
