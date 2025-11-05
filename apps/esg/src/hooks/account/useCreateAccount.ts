import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createAccount } from '@esg/services';
import { CreateAccountPayload } from '@esg/types/account';

type CreateAccountInput = { data: Partial<CreateAccountPayload> };

export const useCreateAccount = (
	page: number,
	size: number,
	companyId?: number | null
) => {
	const queryClient = useQueryClient();

	return useMutation<void, Error, CreateAccountInput>({
		mutationFn: ({ data }) => createAccount(data),
		onSuccess: (_, variables) => {
			// Invalidate queries for the current company context
			if (companyId) {
				queryClient.invalidateQueries({
					queryKey: ['accounts', companyId, page, size],
				});
			}

			// Also invalidate for the company where the account was actually created
			const createdCompanyId = variables.data.companyId;
			if (createdCompanyId && createdCompanyId !== companyId) {
				queryClient.invalidateQueries({
					queryKey: ['accounts', createdCompanyId],
				});
			}

			// Invalidate all account queries as fallback
			queryClient.invalidateQueries({
				queryKey: ['accounts'],
			});
		},
		onError: (error) => {
			alert(error);
		},
	});
};
