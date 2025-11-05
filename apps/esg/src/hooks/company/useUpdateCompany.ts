import { useMutation, useQueryClient } from '@tanstack/react-query';
import { updateCompany } from '@esg/services';
import { UpdateCompanyPayload } from '@esg/types/company';

type UpdateCompanyInput = { id: number; data: Partial<UpdateCompanyPayload> };

export const useUpdateCompany = () => {
	const queryClient = useQueryClient();

	return useMutation<void, Error, UpdateCompanyInput>({
		mutationFn: ({ id, data }) => updateCompany(id, data),
		onSuccess: () => {
			queryClient.invalidateQueries({
				predicate: (query) =>
					[
						'company',
						'companyTree',
						'companyField',
						'companyChild',
						'companyDetail',
					].some((key) => query.queryKey.includes(key)),
			});
		},
		onError: (error) => {
			// Error handling moved to component level with useDeleteSnackbarWithTransition
		},
	});
};
