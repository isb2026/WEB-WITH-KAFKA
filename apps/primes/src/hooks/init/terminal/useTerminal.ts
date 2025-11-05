import { useCreateTerminal } from './useCreateTerminal';
import { useUpdateTerminal } from './useUpdateTerminal';
import { useDeleteTerminal } from './useDeleteTerminal';
import { useTerminalListQuery } from './useTerminalListQuery';

export const useTerminal = (params: { page: number; size: number; searchRequest?: any }) => {
	const list = useTerminalListQuery(params);
	const create = useCreateTerminal();
	const update = useUpdateTerminal(params.page, params.size);
	const remove = useDeleteTerminal();

	return {
		list,
		create,
		update,
		remove,
	};
};
