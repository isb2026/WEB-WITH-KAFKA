import { useRecordListQuery } from './useRecoredListQuery';
import { useCreateRecord } from './useCreateRecord';
import { useUpdateRecord } from './useUpdateRecord';
import { useDeleteRecord } from './useDeleteRecord';
import { SearchRecordRequest } from '@esg/types/record';

export const useRecord = (params: {
	page: number;
	size: number;
	searchRequest?: SearchRecordRequest;
}) => {
	const list = useRecordListQuery(params);
	const create = useCreateRecord();
	const update = useUpdateRecord();
	const remove = useDeleteRecord();

	return {
		list,
		create,
		update,
		remove,
	};
};
