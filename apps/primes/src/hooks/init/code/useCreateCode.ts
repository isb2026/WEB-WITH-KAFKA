import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createCode } from '@primes/services/init/codeService';
import { createCodePayload } from '@primes/types/code';
import { toast } from 'sonner';

type CreateCodeInput = { data: Partial<createCodePayload> };

export const useCreateCode = () => {
	const queryClient = useQueryClient();

	return useMutation<void, Error, CreateCodeInput>({
		mutationFn: ({ data }) => createCode(data),
		onSuccess: () => {
			queryClient.invalidateQueries({
				queryKey: ['codes'],
			});
			queryClient.invalidateQueries({
				queryKey: ['code-field'],
			});
			toast.success('생성이 완료되었습니다.');
		},
		onError: (error) => {
			toast.error(error.message || '코드 생성 실패');
		},
	});
};
