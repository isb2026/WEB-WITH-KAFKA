import { useMutation, useQueryClient } from '@tanstack/react-query';
import { updateStatementMaster } from '@primes/services/sales/statementMasterService';
import { UpdateStatementMasterPayload } from '@primes/types/sales/statementMaster';
import { toast } from 'sonner';

type UpdateStatementInput = {
	id: number;
	data: Partial<UpdateStatementMasterPayload>;
};

export const useUpdateStatementMaster = (page: number, size: number) => {
	const queryClient = useQueryClient();

	return useMutation<void, Error, UpdateStatementInput>({
		mutationFn: ({ id, data }) => updateStatementMaster(id, data),
		onSuccess: (_, { id }) => {
			toast.success('수정이 완료되었습니다.');
			queryClient.invalidateQueries({
				queryKey: ['StatementMaster', page, size],
			});
			queryClient.invalidateQueries({
				queryKey: ['StatementMaster', 'byId', id],
			});
		},
		onError: (error) => {
			toast.error(error.message);
		},
	});
};
