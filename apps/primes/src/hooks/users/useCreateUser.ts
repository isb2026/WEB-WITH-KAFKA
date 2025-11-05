import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createUser } from '@primes/services/users/userService';
import { User } from '@primes/types/users';
import { toast } from 'sonner';

export const useCreateUser = () => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: (data: Partial<User>) => createUser(data),
		onSuccess: () => {
			toast.success('성공저으로 등록되었습니다.');
			queryClient.invalidateQueries({ queryKey: ['users'] });
		},
		onError: (error) => {
			console.log('error', error);
			toast.error(error.message || '사용자 등록 실패');
		},
	});
};
//
