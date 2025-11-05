import { useMutation, useQueryClient } from '@tanstack/react-query';
import { updateProgress } from '@primes/services/init/progressService';
import { ItemProgressUpdateRequest } from '@primes/types/progress';
import { toast } from 'sonner';
import { progressKeys } from './keys';

type UpdateProgressInput = {
	id: number;
	data: Partial<ItemProgressUpdateRequest>;
};

export const useUpdateProgress = () => {
	const queryClient = useQueryClient();

	return useMutation<void, Error, UpdateProgressInput>({
		mutationFn: ({ id, data }) => updateProgress(id, data),
		onSuccess: (_, variables) => {
			toast.success('수정이 완료되었습니다.');
			// progress 관련 모든 쿼리 무효화
			queryClient.invalidateQueries({
				queryKey: progressKeys.base,
			});
			// 특정 itemId가 있는 경우 해당 item의 캐시도 무효화
			if (variables.data.itemId) {
				queryClient.invalidateQueries({
					queryKey: progressKeys.byItemPrefix(variables.data.itemId),
				});
			}
		},
		onError: (error) => {
			toast.error(error.message);
		},
	});
};
