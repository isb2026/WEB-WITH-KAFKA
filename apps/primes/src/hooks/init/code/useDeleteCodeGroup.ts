import { useMutation, useQueryClient } from '@tanstack/react-query';
import { deleteCodeGroup } from '@primes/services/init/codeService';
import { toast } from 'sonner';

export const useDeleteCodeGroup = () => {
	const queryClient = useQueryClient();

	return useMutation<void, Error, number>({
		mutationFn: (id) => deleteCodeGroup(id),
		onSuccess: () => {
			toast.success('삭제가 완료되었습니다.');
			queryClient.invalidateQueries({
				queryKey: ['codes'],
			});
		},
		onError: (error: Error) => {
			toast.error(error.message || '코드 삭제 실패');
		},
	});
};
