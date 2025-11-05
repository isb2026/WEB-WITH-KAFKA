import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createVendors } from '@primes/services/purchase/vendorsService';
import { CreateVendorsPayload } from '@primes/types/purchase/vendors';

type CreateVendorsInput = { data: Partial<CreateVendorsPayload> };

export const useCreateVendors = (page: number, size: number) => {
	const queryClient = useQueryClient();

	return useMutation<void, Error, CreateVendorsInput>({
		mutationFn: ({ data }) => createVendors(data),
		onSuccess: () => {
			queryClient.invalidateQueries({
				queryKey: ['Vendors', page, size],
			});
		},
	});
};
