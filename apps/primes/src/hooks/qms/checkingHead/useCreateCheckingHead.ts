import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createCheckingHead } from '@primes/services/qms/checkingHeadService';
import type { CreateCheckingHeadPayload } from '@primes/types/qms/checkingHead';

/**
 * QMS 검사 헤드 생성 Hook (Atomic Pattern)
 * 단일 책임: 검사 헤드 생성만 담당
 *
 * Swagger API 기반 엔드포인트: /api/checking/heads
 * 배치 생성 지원 ✅ (dataList 구조)
 */
export const useCreateCheckingHead = () => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: (data: CreateCheckingHeadPayload[]) =>
			createCheckingHead(data),
		onSuccess: () => {
			// 관련 쿼리들 무효화
			queryClient.invalidateQueries({ queryKey: ['checking-heads'] });
			queryClient.invalidateQueries({
				queryKey: ['checking-head-fields'],
			});
		},
		onError: (error) => {
			console.error('QMS 검사 헤드 생성 실패:', error);
		},
	});
};
