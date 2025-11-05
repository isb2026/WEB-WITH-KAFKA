import { useMutation, useQueryClient } from '@tanstack/react-query';
import { updateCheckingSample } from '@primes/services/qms/checkingSampleService';
import type { UpdateCheckingSamplePayload } from '@primes/types/qms/checkingSample';

/**
 * QMS 검사 샘플 수정 Hook (Atomic Pattern)
 * 단일 책임: 검사 샘플 수정만 담당
 *
 * Swagger API 기반 필드:
 * - isUse, inspectionType, targetId, targetCode
 * - checkingName, isPass, checkingFormulaId, formula, meta 등 9개 필드
 */
export const useUpdateCheckingSample = () => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: ({
			id,
			data,
		}: {
			id: number;
			data: UpdateCheckingSamplePayload;
		}) => updateCheckingSample(id, data),
		onSuccess: (_, { id }) => {
			// 관련 쿼리들 무효화
			queryClient.invalidateQueries({ queryKey: ['checking-samples'] });
			queryClient.invalidateQueries({
				queryKey: ['checking-sample', id],
			});
			queryClient.invalidateQueries({
				queryKey: ['checking-sample-fields'],
			});
		},
		onError: (error) => {
			console.error('QMS 검사 샘플 수정 실패:', error);
		},
	});
};
