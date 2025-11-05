import { useMoldGradeListQuery } from './useMoldGradeListQuery';
import { useCreateMoldGrade } from './useCreateMoldGrade';
import { useUpdateMoldGrade } from './useUpdateMoldGrade';
import { useDeleteMoldGrade } from './useDeleteMoldGrade';
import { MoldGradeSearchRequest } from '@primes/types/mold';

export const useMoldGrade = (params: { 
	searchRequest?: MoldGradeSearchRequest;
	page: number; 
	size: number; 
}) => {
	const list = useMoldGradeListQuery(params);
	const createMoldGrade = useCreateMoldGrade(params.page, params.size);
	const updateMoldGrade = useUpdateMoldGrade();
	const removeMoldGrade = useDeleteMoldGrade(params.page, params.size);

	return {
		list,
		createMoldGrade,
		updateMoldGrade,
		removeMoldGrade,
	};
}; 