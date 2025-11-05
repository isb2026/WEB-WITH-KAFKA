import { useMutation, useQueryClient } from '@tanstack/react-query';
import { deleteCompany } from '@esg/services';

export const useDeleteCompany = () => {
	const queryClient = useQueryClient();

	return useMutation<void, Error, number>({
		mutationFn: (id) => deleteCompany(id),
		onSuccess: () => {
			queryClient.invalidateQueries({
				predicate: (query) =>
					[
						'company',
						'companyTree',
						'companyDetail',
						'companyField',
						'companyChild',
						'groupCompanies',
						'group',
					].some((key) => query.queryKey.includes(key)),
			});
		},
		onError: (error) => {
			// Error handling moved to component level with useDeleteSnackbarWithTransition
		},
	});
};
