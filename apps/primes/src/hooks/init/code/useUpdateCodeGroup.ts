import { useMutation, useQueryClient } from '@tanstack/react-query';
import { updateCodeGroup } from '@primes/services/init/codeService';
import { updateCodeGroupPayload } from '@primes/types/code';
import { toast } from 'sonner';

type UpdateCodeInput = {
	id: number;
	data: Partial<updateCodeGroupPayload>;
};

export const useUpdateCodeGroup = () => {
	const queryClient = useQueryClient();

	return useMutation<void, Error, UpdateCodeInput>({
		mutationFn: ({ id, data }) => updateCodeGroup(id, data),
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
