import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createStatementDetail } from '@primes/services/sales/statementDetailService';
import { toast } from 'sonner';

type CreateStatementDetailInput = any[];

export const useCreateStatementDetail = (page: number, size: number) => {
	const queryClient = useQueryClient();

	return useMutation<void, Error, CreateStatementDetailInput>({
		mutationFn: (data) => createStatementDetail(data),
		onSuccess: () => {
			toast.success('명세서 상세가 생성되었습니다.');
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
