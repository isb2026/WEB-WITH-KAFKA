import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createCheckingSpec } from '@primes/services/qms/checkingSpecService';
import type { CreateCheckingSpecPayload } from '@primes/types/qms/checkingSpec';

/**
 * QMS 검사 규격 생성 Hook (Atomic Pattern)
 * 단일 책임: 검사 규격 생성만 담당
 *
 * Swagger API 기반 필드:
 * - inspectionType, checkingFormulaId, checkingName, orderNo
 * - standard, standardUnit, checkPeriod, sampleQuantity
 * - targetId, targetCode 등 12개 필드
 */
export const useCreateCheckingSpec = () => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: (data: CreateCheckingSpecPayload[]) =>
			createCheckingSpec(data),
		onSuccess: () => {
			// 관련 쿼리들 무효화
			queryClient.invalidateQueries({ queryKey: ['checking-specs'] });
			queryClient.invalidateQueries({
				queryKey: ['checking-spec-fields'],
			});
		},
		onError: (error) => {
			console.error('QMS 검사 규격 생성 실패:', error);
		},
	});
};
