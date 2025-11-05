import { useMutation, useQueryClient } from '@tanstack/react-query';
import { deleteCode } from '@primes/services/init/codeService';
import { toast } from 'sonner';
export const useDeleteCode = () => {
	const queryClient = useQueryClient();

	return useMutation<void, Error, number>({
		mutationFn: (id) => deleteCode(id),
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
