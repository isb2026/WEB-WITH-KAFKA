import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createMoldOrderMaster } from '@primes/services/mold/moldOrderMasterService';
import {
	MoldOrderMasterDto,
	MoldOrderMasterCreateRequest,
} from '@primes/types/mold';
import { toast } from 'sonner';

export const useCreateMoldOrderMaster = (page: number, size: number) => {
	const queryClient = useQueryClient();

	return useMutation<MoldOrderMasterDto, Error, MoldOrderMasterCreateRequest>(
		{
			mutationFn: (data) => {
				console.log('Creating mold order master with data:', data);
				return createMoldOrderMaster(data);
			},
			onSuccess: (data) => {
				console.log('Mold order master created successfully:', data);
				toast.success('성공적으로 등록 되었습니다.');
				// Invalidate all moldOrderMaster queries to ensure list updates
				queryClient.invalidateQueries({
					queryKey: ['moldOrderMaster'],
				});
			},
			onError: (error) => {
				console.error('Error creating mold order master:', error);
				toast.error(error.message);
			},
		}
	);
};
