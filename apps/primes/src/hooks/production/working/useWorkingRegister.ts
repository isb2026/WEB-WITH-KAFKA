import { useMutation, useQueryClient } from '@tanstack/react-query';
import { registerWorkingResult } from '@primes/services/production/workingService';
import type {
	WorkingResultRegisterRequest,
	WorkingResultRegisterResponse,
} from '@primes/types/production';
import { toast } from 'sonner';

export const useWorkingRegister = () => {
	const queryClient = useQueryClient();

	return useMutation<
		WorkingResultRegisterResponse,
		Error,
		WorkingResultRegisterRequest
	>({
		mutationFn: async (data) => {
			console.log('=== useWorkingRegister Hook DEBUG ===');
			console.log('Mutation data:', data);

			try {
				const result = await registerWorkingResult(data);
				console.log('Mutation successful:', result);
				return result;
			} catch (error: any) {
				console.error('Mutation failed:', error);
				throw error;
			}
		},
		onSuccess: (data, variables) => {
			console.log('Working register success:', data);
			toast.success('작업 등록이 성공적으로 완료되었습니다.');

			// 작업 관련 쿼리 무효화
			queryClient.invalidateQueries({
				queryKey: ['working'],
			});
			queryClient.invalidateQueries({
				queryKey: ['working', 'list'],
			});
			queryClient.invalidateQueries({
				queryKey: ['command'],
			});
		},
		onError: (error, variables) => {
			console.error('Working register error:', error);
			console.error('Failed variables:', variables);

			// 더 구체적인 에러 메시지 제공
			let errorMessage = '작업 등록 중 오류가 발생했습니다.';
			if (error.message) {
				errorMessage = error.message;
			} else if (typeof error === 'string') {
				errorMessage = error;
			}

			toast.error(`작업 등록 실패: ${errorMessage}`);
		},
	});
};
