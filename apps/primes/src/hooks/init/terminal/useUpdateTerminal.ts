import { useMutation, useQueryClient } from '@tanstack/react-query';
import { updateTerminal } from '@primes/services/init/terminalService';
import { updateTerminalPayload } from '@primes/types/terminal';
import { toast } from 'sonner';

type UpdateTerminalInput = { id: number; data: Partial<updateTerminalPayload> };

export const useUpdateTerminal = (page: number, size: number) => {
	const queryClient = useQueryClient();

	return useMutation<void, Error, UpdateTerminalInput>({
		mutationFn: ({ id, data }) => updateTerminal(id, data),
		onSuccess: () => {
			toast.success('수정이 완료되었습니다.');
			queryClient.invalidateQueries({
				queryKey: ['terminal', page, size],
			});
		},
		onError: (error) => {
			toast.error(error.message);
		},
	});
};
