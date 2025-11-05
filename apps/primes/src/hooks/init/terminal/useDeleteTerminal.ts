import { useMutation, useQueryClient } from '@tanstack/react-query';
import { deleteTerminal } from '@primes/services/init/terminalService';
import { toast } from 'sonner';

export const useDeleteTerminal = () => {
	const queryClient = useQueryClient();

	return useMutation<void, Error, number | number[]>({
		mutationFn: (ids) => {
			// Convert single ID to array for the new bulk delete API
			const idsArray = Array.isArray(ids) ? ids : [ids];
			return deleteTerminal(idsArray);
		},
		onSuccess: () => {
			toast.success('터미널이 삭제되었습니다.');
			// Invalidate all terminal-related queries
			queryClient.invalidateQueries({
				queryKey: ['terminal'],
			});
			queryClient.invalidateQueries({
				queryKey: ['terminal-field'],
			});
		},
		onError: (error) => {
			toast.error(`삭제 실패: ${error.message}`);
		},
	});
};

// Legacy version for backward compatibility
export const useDeleteTerminalLegacy = (page: number, size: number) => {
	const queryClient = useQueryClient();

	return useMutation<void, Error, { id: number } | number>({
		mutationFn: (input) => {
			const id = typeof input === 'object' ? input.id : input;
			return deleteTerminal([id]);
		},
		onSuccess: () => {
			toast.success('터미널이 삭제되었습니다.');
			queryClient.invalidateQueries({
				queryKey: ['terminal', page, size],
			});
		},
		onError: (error) => {
			toast.error(`삭제 실패: ${error.message}`);
		},
	});
};
