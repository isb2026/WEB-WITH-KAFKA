import { useMutation, useQueryClient } from '@tanstack/react-query';
import { updateCheckingSpec } from '@primes/services/qms/checkingSpecService';
import type { UpdateCheckingSpecPayload } from '@primes/types/qms/checkingSpec';

/**
 * QMS 검사 규격 수정 Hook (Atomic Pattern)
 * 단일 책임: 검사 규격 수정만 담당
 *
 * Swagger API 기반 필드:
 * - isUse, inspectionType, checkingFormulaId, checkingName
 * - orderNo, standard, standardUnit, checkPeriod
 * - sampleQuantity, targetId, targetCode 등 13개 필드
 */
export const useUpdateCheckingSpec = () => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: ({
			id,
			data,
		}: {
			id: number;
			data: UpdateCheckingSpecPayload;
		}) => updateCheckingSpec(id, data),
		onSuccess: (_, { id }) => {
			// 관련 쿼리들 무효화
			queryClient.invalidateQueries({ queryKey: ['checking-specs'] });
			queryClient.invalidateQueries({ queryKey: ['checking-spec', id] });
			queryClient.invalidateQueries({
				queryKey: ['checking-spec-fields'],
			});
		},
		onError: (error) => {
			console.error('QMS 검사 규격 수정 실패:', error);
		},
	});
};
