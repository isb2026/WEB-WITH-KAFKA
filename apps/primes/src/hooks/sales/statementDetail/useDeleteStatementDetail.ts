import { useMutation, useQueryClient } from '@tanstack/react-query';
import { deleteStatementDetail } from '@primes/services/sales/statementDetailService';
import { toast } from 'sonner';

type DeleteStatementDetailInput = { ids: number[] };

export const useDeleteStatementDetail = (page: number, size: number) => {
	const queryClient = useQueryClient();

	return useMutation<void, Error, DeleteStatementDetailInput>({
		mutationFn: ({ ids }) => deleteStatementDetail(ids),
		onSuccess: () => {
			toast.success('명세서 상세가 삭제되었습니다.');
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
