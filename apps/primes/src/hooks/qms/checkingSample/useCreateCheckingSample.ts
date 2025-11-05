import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createCheckingSample } from '@primes/services/qms/checkingSampleService';
import type { CreateCheckingSamplePayload } from '@primes/types/qms/checkingSample';

/**
 * QMS 검사 샘플 생성 Hook (Atomic Pattern)
 * 단일 책임: 검사 샘플 생성만 담당
 *
 * Swagger API 기반 필드:
 * - checkingHeadId, sampleIndex, measuredValue, measureUnit
 * - isPass, checkingName, orderNo, standard, standardUnit 등 9개 필드
 */
export const useCreateCheckingSample = () => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: (data: CreateCheckingSamplePayload[]) =>
			createCheckingSample(data),
		onSuccess: () => {
			// 관련 쿼리들 무효화
			queryClient.invalidateQueries({ queryKey: ['checking-samples'] });
			queryClient.invalidateQueries({
				queryKey: ['checking-sample-fields'],
			});
		},
		onError: (error) => {
			console.error('QMS 검사 샘플 생성 실패:', error);
		},
	});
};
