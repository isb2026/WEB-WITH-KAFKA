import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createProgress } from '@primes/services/init/progressService';
import { ItemProgressCreateRequest } from '@primes/types/progress';
import { toast } from 'sonner';
import { progressKeys } from './keys';

type CreateProgressInput = { data: Partial<ItemProgressCreateRequest> };

export const useCreateProgress = () => {
	const queryClient = useQueryClient();

	return useMutation<void, Error, CreateProgressInput>({
		mutationFn: ({ data }) => createProgress(data),
		onSuccess: (_, variables) => {
			console.log(
				'🎉 Progress created successfully, invalidating caches...'
			);
			console.log(
				'📝 Created progress for itemId:',
				variables.data.itemId
			);

			toast.success('생성이 완료되었습니다.');

			// progress 관련 모든 쿼리 무효화
			queryClient.invalidateQueries({
				queryKey: progressKeys.base,
			});

			// 특정 itemId가 있는 경우 해당 item의 캐시도 무효화
			if (variables.data.itemId) {
				const itemId = variables.data.itemId;
				console.log('🔄 Invalidating queries for itemId:', itemId);

				queryClient.invalidateQueries({
					queryKey: progressKeys.byItemPrefix(itemId),
				});

				// 추가로 모든 progress 관련 쿼리를 강제로 다시 가져오기
				queryClient.refetchQueries({
					queryKey: progressKeys.base,
				});
			}
		},
		onError: (error) => {
			console.error('❌ Progress creation failed:', error);
			toast.error(error.message);
		},
	});
};
