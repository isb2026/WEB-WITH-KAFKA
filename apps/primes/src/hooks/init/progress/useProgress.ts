import { useCreateProgress } from './useCreateProgress';
import { useUpdateProgress } from './useUpdateProgress';
import { useDeleteProgress } from './useDeleteProgress';
import { useProgressListQuery } from './useProgressListQuery';
import { ItemProgressSearchRequest } from '@primes/types/progress';

export const useProgress = (params: {
	page?: number;
	size?: number;
	searchRequest?: ItemProgressSearchRequest;
	enabled?: boolean;
}) => {
	const list = useProgressListQuery({
		page: params.page ?? 0,
		size: params.size ?? 30,
		searchRequest: params.searchRequest,
		enabled: params.enabled,
	});
	const create = useCreateProgress();
	const update = useUpdateProgress();
	const remove = useDeleteProgress();

	return {
		list,
		create,
		update,
		remove,
	};
};
