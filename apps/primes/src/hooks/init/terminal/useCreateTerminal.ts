import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createTerminal } from '@primes/services/init/terminalService';
import { TerminalCreateRequest } from '@primes/types/terminal';
import { toast } from 'sonner';

export const useCreateTerminal = () => {
	const queryClient = useQueryClient();

	return useMutation<any, Error, Partial<TerminalCreateRequest>>({
		mutationFn: (data) => createTerminal(data),
		onSuccess: () => {
			toast.success('터미널이 생성되었습니다.');
			// Invalidate all terminal-related queries
			queryClient.invalidateQueries({
				queryKey: ['terminal'],
			});
			queryClient.invalidateQueries({
				queryKey: ['terminal-field'],
			});
		},
		onError: (error) => {
			toast.error(`생성 실패: ${error.message}`);
		},
	});
};

// Legacy version for backward compatibility
export const useCreateTerminalLegacy = (page: number, size: number) => {
	const queryClient = useQueryClient();

	return useMutation<any, Error, { data: Partial<TerminalCreateRequest> }>({
		mutationFn: ({ data }) => createTerminal(data),
		onSuccess: () => {
			toast.success('터미널이 생성되었습니다.');
			queryClient.invalidateQueries({
				queryKey: ['terminal', page, size],
			});
		},
		onError: (error) => {
			toast.error(`생성 실패: ${error.message}`);
		},
	});
};
