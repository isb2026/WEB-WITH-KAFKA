import { useMutation, useQueryClient } from '@tanstack/react-query';
import { deleteUser } from '@primes/services/users/userService';
import { toast } from 'sonner';

export const useDeleteUser = (page: number, size: number) => {
	const queryClient = useQueryClient();

	return useMutation<void, Error, string>({
		mutationFn: (username) => deleteUser(username),
		onSuccess: () => {
			toast.success('삭제가 완료되었습니다.');
			queryClient.invalidateQueries({
				queryKey: ['users', page, size],
			});
		},
		onError: (error: Error) => {
			toast.error(error.message || '삭제 실패');
		},
	});
};
