import { useMutation, useQueryClient } from '@tanstack/react-query';
import { updateStatementDetail } from '@primes/services/sales/statementDetailService';
import { UpdateStatementDetailPayload } from '@primes/types/sales/statementDetail';
import { toast } from 'sonner';

type UpdateStatementDetailInput = {
	id: number;
	data: Partial<UpdateStatementDetailPayload>;
};

export const useUpdateStatementDetail = (page: number, size: number) => {
	const queryClient = useQueryClient();

	return useMutation<void, Error, UpdateStatementDetailInput>({
		mutationFn: ({ id, data }) => updateStatementDetail(id, data),
		onSuccess: () => {
			toast.success('명세서 상세가 수정되었습니다.');
			// Invalidate all statement detail queries
			queryClient.invalidateQueries({
				queryKey: ['StatementDetail'],
			});
		},
		onError: (error) => {
			toast.error(error.message);
		},
	});
};
