import { useMutation, useQueryClient } from '@tanstack/react-query';
import { registerWorkingResult } from '@primes/services/production/workingService';
import {
	WorkingResultRegisterRequest,
	WorkingResultRegisterResponse,
} from '@primes/types/production';
import { toast } from 'sonner';

export const useRegisterWorkingResult = () => {
	const queryClient = useQueryClient();

	return useMutation<
		WorkingResultRegisterResponse,
		Error,
		WorkingResultRegisterRequest
	>({
		mutationFn: (data) => {
			return registerWorkingResult(data);
		},
		onSuccess: (data) => {
			toast.success(
				`작업실적이 등록되었습니다. 생성된 로트: ${data.createdLots.length}개`
			);

			// 관련 쿼리 무효화
			queryClient.invalidateQueries({
				queryKey: ['working'],
			});
			queryClient.invalidateQueries({
				queryKey: ['lot-master'],
			});
			queryClient.invalidateQueries({
				queryKey: ['working-in-lot'],
			});
			queryClient.invalidateQueries({
				queryKey: ['using-lot'],
			});
		},
		onError: (error) => {
			toast.error(`작업실적 등록 실패: ${error.message}`);
		},
	});
};
