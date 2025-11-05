import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createCodeGroup } from '@primes/services/init/codeService';
import { createCodeGroupPayload } from '@primes/types/code';
import { toast } from 'sonner';

type CreateCodeGroupInput = { data: Partial<createCodeGroupPayload> };

export const useCreateCodeGroup = () => {
	const queryClient = useQueryClient();

	return useMutation<void, Error, CreateCodeGroupInput>({
		mutationFn: ({ data }) => createCodeGroup(data),
		onSuccess: () => {
			queryClient.invalidateQueries({
				queryKey: ['codes'],
			});
			toast.success('코드 그룹 등록이 완료되었습니다.');
		},
		onError: (error) => {
			toast.error(error.message || '코드 생성 실패');
		},
	});
};
