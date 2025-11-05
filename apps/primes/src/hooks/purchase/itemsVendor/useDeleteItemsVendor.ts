import { useMutation, useQueryClient } from '@tanstack/react-query';
import { deleteItemsVendor } from '@primes/services/purchase/itemsVendorService';
import { toast } from 'sonner';

type DeleteItemsVendorInput = { ids: number[] };

export const useDeleteItemsVendor = () => {
	const queryClient = useQueryClient();

	return useMutation<void, Error, DeleteItemsVendorInput>({
		mutationFn: ({ ids }) => {
			return deleteItemsVendor(ids);
		},
		onSuccess: () => {
			toast.success('성공적으로 삭제 되었습니다.');
			queryClient.invalidateQueries({
				queryKey: ['ItemsVendor'],
			});
		},
		onError: (error) => {
			console.error('Delete failed:', error);
			toast.error(error.message);
		},
	});
};
