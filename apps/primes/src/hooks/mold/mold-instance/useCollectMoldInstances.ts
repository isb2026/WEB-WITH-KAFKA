import { useMutation, useQueryClient } from '@tanstack/react-query';
import { collectMoldInstances } from '@primes/services/mold/moldInstanceService';
import { MoldInstanceCollectRequest } from '@primes/types/mold';
import { toast } from 'sonner';

export const useCollectMoldInstances = () => {
	const queryClient = useQueryClient();

	return useMutation<any, Error, MoldInstanceCollectRequest>({
		mutationFn: (moldInstanceIds) => collectMoldInstances(moldInstanceIds),
		onSuccess: () => {
			// 관련 쿼리들을 무효화하여 데이터 새로고침
			queryClient.invalidateQueries({
				queryKey: ['moldInstance'],
			});
			queryClient.invalidateQueries({
				queryKey: ['moldInoutInformation'],
			});
			toast.success('금형 회수가 완료되었습니다.');
		},
		onError: (error) => {
			console.error('금형 회수 실패:', error);
			toast.error(error.message || '금형 회수 중 오류가 발생했습니다.');
		},
	});
};
