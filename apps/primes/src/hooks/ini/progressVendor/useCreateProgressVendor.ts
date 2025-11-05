import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createProgressVendor, ProgressVendorCreateRequest } from '@primes/services/init/progressVendorService';
import { toast } from 'sonner';

type CreateProgressVendorInput = { data: Partial<ProgressVendorCreateRequest> };

export const useCreateProgressVendor = () => {
	const queryClient = useQueryClient();

	return useMutation<void, Error, CreateProgressVendorInput>({
		mutationFn: ({ data }) => createProgressVendor(data),
		onSuccess: () => {
			toast.success('거래처 연결이 완료되었습니다.');
			queryClient.invalidateQueries({
				queryKey: ['progress-vendors'],
			});
			queryClient.invalidateQueries({
				queryKey: ['progress'],
			});
		},
		onError: (error) => {
			toast.error(error.message);
		},
	});
}; 