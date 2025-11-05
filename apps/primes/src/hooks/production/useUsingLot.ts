import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createUsingLotList } from '@primes/services/production/workingService';
import { UsingLotCreateRequest } from '@primes/types/production';
import { toast } from 'sonner';

// 사용량 기록 생성 (일괄)
export const useCreateUsingLot = () => {
	const queryClient = useQueryClient();

	return useMutation<any[], Error, UsingLotCreateRequest[]>({
		mutationFn: (data) => {
			return createUsingLotList(data);
		},
		onSuccess: () => {
			toast.success('사용량이 기록되었습니다.');

			// 관련 쿼리 무효화
			queryClient.invalidateQueries({
				queryKey: ['using-lot'],
			});
			queryClient.invalidateQueries({
				queryKey: ['working-buffer'],
			});
			queryClient.invalidateQueries({
				queryKey: ['lot-master'],
			});
		},
		onError: (error) => {
			toast.error(`사용량 기록 실패: ${error.message}`);
		},
	});
};
