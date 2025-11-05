import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createCompany } from '@esg/services';
import { createCompanyPayload } from '@esg/types/company';

type CreateCompanyInput = { data: Partial<createCompanyPayload> };

export const useCreateCompany = () => {
	const queryClient = useQueryClient();

	return useMutation<void, Error, CreateCompanyInput>({
		mutationFn: ({ data }) => createCompany(data),
		onSuccess: () => {
			queryClient.invalidateQueries({
				predicate: (query) =>
					[
						'company',
						'companyTree',
						'companyDetail',
						'companyField',
						'companyChild',
						'group',
						'groupCompanies',
					].some((key) => query.queryKey.includes(key)),
			});
		},
		onError: (error) => {
			// Error handling moved to component level with useDeleteSnackbarWithTransition
		},
	});
};
