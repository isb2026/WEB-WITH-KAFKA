import { useCreateCommandProgress } from './useCreateCommandProgress';
import { useUpdateCommandProgress } from './useUpdateCommandProgress';
import { useDeleteCommandProgress } from './useDeleteCommandProgress';
import { useCommandProgressListQuery } from './useCommandProgressListQuery';
import { CommandProgressSearchRequest } from '@primes/types/production/commandProgressTypes';

interface CommandProgressParams {
	page?: number;
	size?: number;
	searchRequest?: CommandProgressSearchRequest;
	enabled?: boolean;
}

export const useCommandProgress = (params: CommandProgressParams = {}) => {
	const list = useCommandProgressListQuery(params);
	const create = useCreateCommandProgress();
	const update = useUpdateCommandProgress();
	const remove = useDeleteCommandProgress();

	return { list, create, update, remove };
}; 