import { useMutation, useQueryClient } from '@tanstack/react-query';
import { updateUser } from '@primes/services/users/userService';
import { User } from '@primes/types/users';
import { toast } from 'sonner';

type UpdateUserInput = { username: string; data: Partial<User> };

export const useUpdateUser = (page: number, size: number) => {
	const queryClient = useQueryClient();

	return useMutation<void, Error, UpdateUserInput>({
		mutationFn: ({ username, data }) => updateUser(username, data),
		onSuccess: () => {
			toast.success('사용자 정보가 수정되었습니다.');
			queryClient.invalidateQueries({
				queryKey: ['users', page, size], // 정확히 일치하게!
			});
		},
		onError: (error: Error) => {
			toast.error(error.message || '사용자 수정 실패');
		},
	});
};
