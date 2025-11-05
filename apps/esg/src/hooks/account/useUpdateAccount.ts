import { useMutation, useQueryClient } from '@tanstack/react-query';
import { updateAccount } from '@esg/services';
import { UpdateAccountPayload } from '@esg/types/account';

export const useUpdateAccount = (
	page: number,
	size: number,
	companyId?: number | null
) => {
	const queryClient = useQueryClient();

	return useMutation<void, Error, { id: number; data: UpdateAccountPayload}>({
		mutationFn: ({ id, data }) => updateAccount(id, data),
		onSuccess: () => {
			queryClient.invalidateQueries({
				queryKey: ['accounts', companyId ?? null, page, size],
			});
		},
		onError: (error) => {
			// handled by caller
		},
	});
};
