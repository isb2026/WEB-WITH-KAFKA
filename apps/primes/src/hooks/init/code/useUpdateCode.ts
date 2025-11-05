import { useMutation, useQueryClient } from '@tanstack/react-query';
import { updateCode } from '@primes/services/init/codeService';
import { updateCodePayload } from '@primes/types/code';
import { toast } from 'sonner';

type UpdateCodeInput = {
	id: number;
	data: Partial<updateCodePayload>;
};

export const useUpdateCode = () => {
	const queryClient = useQueryClient();

	return useMutation<void, Error, UpdateCodeInput>({
		mutationFn: ({ id, data }) => updateCode(id, data),
		onSuccess: () => {
			toast.success('수정이 완료되었습니다.');
			queryClient.invalidateQueries({
				queryKey: ['codes'],
			});
		},
		onError: (error: Error) => {
			toast.error(error.message || '코드 수정 실패');
		},
	});
};
