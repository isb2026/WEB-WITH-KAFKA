import { useMutation, useQueryClient } from '@tanstack/react-query';
import { deleteStatementMaster } from '@primes/services/sales/statementMasterService';
import { toast } from 'sonner';

type DeleteStatementMasterInput = { ids: number[] };

export const useDeleteStatementMaster = (page: number, size: number) => {
	const queryClient = useQueryClient();

	return useMutation<void, Error, DeleteStatementMasterInput>({
		mutationFn: ({ ids }) => deleteStatementMaster(ids),
		onSuccess: () => {
			toast.success('삭제가 완료되었습니다.');
			queryClient.invalidateQueries({
				queryKey: ['StatementMaster', page, size],
			});
		},
		onError: (error) => {
			toast.error(error.message);
		},
	});
};
