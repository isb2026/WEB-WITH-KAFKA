import { useCreateDefectRecord } from './useCreateDefectRecord';
import { useUpdateDefectRecord } from './useUpdateDefectRecord';
import { useDeleteDefectRecord } from './useDeleteDefectRecord';
import { useDefectRecordListQuery } from './useDefectRecordListQuery';
import { DefectRecordSearchRequest } from '@primes/types/production/defectTypes';

interface DefectRecordParams {
	page?: number;
	size?: number;
	searchRequest?: DefectRecordSearchRequest;
}

export const useDefectRecords = (params: DefectRecordParams = {}) => {
	const list = useDefectRecordListQuery(params);
	const create = useCreateDefectRecord();
	const update = useUpdateDefectRecord();
	const remove = useDeleteDefectRecord();

	return { list, create, update, remove };
};