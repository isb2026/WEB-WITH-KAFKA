import { useCreateDefectAction } from './useCreateDefectAction';
import { useUpdateDefectAction } from './useUpdateDefectAction';
import { useDefectActionListQuery } from './useDefectActionListQuery';
import { DefectActionSearchRequest } from '@primes/types/production/defectTypes';
import { useDeleteDefectAction } from './useDeleteDefectAction';

interface DefectActionParams {
	page?: number;
	size?: number;
	searchRequest?: DefectActionSearchRequest;
}

export const useDefectActions = (params: DefectActionParams = {}) => {
	const list = useDefectActionListQuery(params);
	const create = useCreateDefectAction();
	const update = useUpdateDefectAction();
	const remove = useDeleteDefectAction();

	return { list, create, update, remove };
};
