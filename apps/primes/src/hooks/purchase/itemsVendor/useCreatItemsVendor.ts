import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createItemsVendor } from '@primes/services/purchase/itemsVendorService';
import { CreateItemsVendorPayload } from '@primes/types/purchase/itemsVendor';
import { toast } from 'sonner';

type CreateItemsVendorInput = { data: CreateItemsVendorPayload[] };

export const useCreateItemsVendor = () => {
	const queryClient = useQueryClient();

	return useMutation<void, Error, CreateItemsVendorInput>({
		mutationFn: ({ data }) => createItemsVendor(data),
		onSuccess: () => {
			toast.success('성공적으로 등록 되었습니다.');
			queryClient.invalidateQueries({
				queryKey: ['ItemsVendor'],
			});
		},
		onError: (error) => {
			toast.error(error.message);
		},
	});
};
