import { useCreateCommand } from './useCreateCommand';
import { useUpdateCommand } from './useUpdateCommand';
import { useDeleteCommand } from './useDeleteCommand';
import { useCommandListQuery } from './useCommandListQuery';
import { CommandSearchRequest } from '@primes/types/production';

interface CommandParams {
	page?: number;
	size?: number;
	searchRequest?: CommandSearchRequest;
	includeProductionProgress?: boolean;
}

export const useCommands = (params: CommandParams = {}) => {
	const list = useCommandListQuery(params);
	const create = useCreateCommand();
	const update = useUpdateCommand();
	const remove = useDeleteCommand();

	return { list, create, update, remove };
};
