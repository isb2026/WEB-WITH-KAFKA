import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createStatementMaster } from '@primes/services/sales/statementMasterService';
import { CreateStatementMasterPayload } from '@primes/types/sales/statementMaster';
import { toast } from 'sonner';

type CreateStatementInput = { data: Partial<CreateStatementMasterPayload> };

export const useCreateStatementMaster = (page: number, size: number) => {
	const queryClient = useQueryClient();

	return useMutation<void, Error, CreateStatementInput>({
		mutationFn: ({ data }) => createStatementMaster(data),
		onSuccess: () => {
			toast.success('생성이 완료되었습니다.');
			queryClient.invalidateQueries({
				queryKey: ['StatementMaster', page, size],
			});
		},
		onError: (error) => {
			toast.error(error.message);
		},
	});
};
