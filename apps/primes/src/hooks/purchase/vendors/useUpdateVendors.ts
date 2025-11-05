import { useMutation, useQueryClient } from '@tanstack/react-query';
import { updateVendors } from '@primes/services/purchase/vendorsService';
import { UpdateVendorsPayload } from '@primes/types/purchase/vendors';

type UpdateVendorsInput = { id: number; data: Partial<UpdateVendorsPayload> };

export const useUpdateVendors = (page: number, size: number) => {
	const queryClient = useQueryClient();

	return useMutation<void, Error, UpdateVendorsInput>({
		mutationFn: ({ id, data }) => updateVendors(id, data),
		onSuccess: () => {
			queryClient.invalidateQueries({
				queryKey: ['Vendors', 'list', { page, size }],
			});
		},
	});
};
