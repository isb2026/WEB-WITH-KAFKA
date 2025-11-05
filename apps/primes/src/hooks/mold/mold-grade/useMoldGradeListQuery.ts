import { useQuery, keepPreviousData } from '@tanstack/react-query';
import { getMoldGradeList } from '@primes/services/mold/moldGradeService';
import { MoldGradeSearchRequest } from '@primes/types/mold';

export const useMoldGradeListQuery = (params: { 
	searchRequest?: MoldGradeSearchRequest;
	page: number; 
	size: number; 
}) => {
	return useQuery({
		queryKey: ['moldGrade', params.searchRequest, params.page, params.size],
		queryFn: () => getMoldGradeList(params.searchRequest, params.page, params.size),
		placeholderData: keepPreviousData,
		staleTime: 1000 * 60 * 3,
	});
}; 