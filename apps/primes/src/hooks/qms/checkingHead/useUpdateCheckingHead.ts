import { useMutation, useQueryClient } from '@tanstack/react-query';
import { updateCheckingHead } from '@primes/services/qms/checkingHeadService';
import type { UpdateCheckingHeadPayload } from '@primes/types/qms/checkingHead';

/**
 * QMS 검사 헤드 수정 Hook (Atomic Pattern)
 * 단일 책임: 검사 헤드 수정만 담당
 *
 * Swagger API 기반 필드:
 * - isUse, inspectionType, targetId, targetCode, checkingName
 */
export const useUpdateCheckingHead = () => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: ({
			id,
			data,
		}: {
			id: number;
			data: UpdateCheckingHeadPayload;
		}) => updateCheckingHead(id, data),
		onSuccess: (_, { id }) => {
			// 관련 쿼리들 무효화
			queryClient.invalidateQueries({ queryKey: ['checking-heads'] });
			queryClient.invalidateQueries({ queryKey: ['checking-head', id] });
			queryClient.invalidateQueries({
				queryKey: ['checking-head-fields'],
			});
		},
		onError: (error) => {
			console.error('QMS 검사 헤드 수정 실패:', error);
		},
	});
};
