import { useMutation, useQueryClient } from '@tanstack/react-query';
import { inputMoldInstances } from '@primes/services/mold/moldInstanceService';
import { MoldInstanceInputRequest } from '@primes/types/mold';
import { toast } from 'sonner';

export const useInputMoldInstances = () => {
	const queryClient = useQueryClient();

	return useMutation<any, Error, MoldInstanceInputRequest>({
		mutationFn: (data) => inputMoldInstances(data),
		onSuccess: () => {
			// 관련 쿼리들을 무효화하여 데이터 새로고침
			queryClient.invalidateQueries({
				queryKey: ['moldInstance'],
			});
			queryClient.invalidateQueries({
				queryKey: ['moldInoutInformation'],
			});
			toast.success('금형 투입이 완료되었습니다.');
		},
		onError: (error) => {
			console.error('금형 투입 실패:', error);
			toast.error(error.message || '금형 투입 중 오류가 발생했습니다.');
		},
	});
};
