import { useMutation, useQueryClient } from '@tanstack/react-query';
import { deleteVendors } from '@primes/services/purchase/vendorsService';

type DeleteVendorsInput = { id: number };

export const useDeleteVendors = (page: number, size: number) => {
	const queryClient = useQueryClient();

	return useMutation<void, Error, DeleteVendorsInput>({
		mutationFn: ({ id }) => deleteVendors(id),
		onSuccess: () => {
			queryClient.invalidateQueries({
				queryKey: ['Vendors', page, size],
			});
		},
	});
};
