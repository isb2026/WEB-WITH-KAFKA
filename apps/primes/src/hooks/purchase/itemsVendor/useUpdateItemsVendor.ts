import { useMutation, useQueryClient } from '@tanstack/react-query';
import { updateItemsVendor, updateItemsVendorById } from '@primes/services/purchase/itemsVendorService';
import { UpdateItemsVendorPayload } from '@primes/types/purchase/itemsVendor';
import { toast } from 'sonner';

type UpdateItemsVendorInput = {
	id: number;
	data: UpdateItemsVendorPayload;
};

type UpdateItemsVendorBulkInput = {
	data: UpdateItemsVendorPayload[];
};

export const useUpdateItemsVendor = () => {
	const queryClient = useQueryClient();

	return useMutation<void, Error, UpdateItemsVendorBulkInput>({
		mutationFn: ({ data }) => updateItemsVendor(data),
		onSuccess: () => {
			toast.success('성공적으로 수정 되었습니다.');
			queryClient.invalidateQueries({
				queryKey: ['ItemsVendor'],
			});
		},
		onError: (error) => {
			toast.error(error.message);
		},
	});
};

export const useUpdateItemsVendorById = () => {
	const queryClient = useQueryClient();

	return useMutation<void, Error, UpdateItemsVendorInput>({
		mutationFn: ({ id, data }) => updateItemsVendorById(id, data),
		onSuccess: () => {
			toast.success('성공적으로 수정 되었습니다.');
			queryClient.invalidateQueries({
				queryKey: ['ItemsVendor'],
			});
		},
		onError: (error) => {
			toast.error(error.message);
		},
	});
};
