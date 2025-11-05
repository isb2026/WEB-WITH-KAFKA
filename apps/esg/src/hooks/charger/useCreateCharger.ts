import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createCharger } from '@esg/services/chargerService';
import { CompanyManager } from '@esg/types/company_manager';

type CreateChargerInput = Partial<CompanyManager>;

export const useCreateCharger = () => {
	const queryClient = useQueryClient();

	return useMutation<void, Error, any>({
		mutationFn: (data) => createCharger(data),
		onSuccess: () => {
			queryClient.invalidateQueries({
				predicate: (query) =>
					[
						'chargerList',
						'chargerDetail',
					].some((key) => query.queryKey.includes(key)),
			});
		},
		onError: (error) => {
			// Error handling moved to component level
		},
	});
};
