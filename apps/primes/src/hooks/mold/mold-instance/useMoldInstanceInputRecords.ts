import { useQuery } from '@tanstack/react-query';
import { getMoldInstanceByInputCommandId } from '@primes/services/mold/moldInstanceService';
import { keepPreviousData } from '@tanstack/react-query';

/**
 * inputCommandId로 투입된 mold instance 목록을 조회하는 hook
 * 기존 mold-inout-information과 완전히 분리된 새로운 hook
 */
export const useMoldInstanceInputRecords = (params: {
	inputCommandId?: number;
	page: number;
	size: number;
}) => {
	const { inputCommandId, page, size } = params;

	const query = useQuery({
		queryKey: ['moldInstanceInputRecords', inputCommandId, page, size],
		queryFn: () => getMoldInstanceByInputCommandId(inputCommandId!, true, page, size),
		placeholderData: keepPreviousData,
		staleTime: 1000 * 60 * 3, // 3분간 캐시 유지
		enabled: !!inputCommandId, // inputCommandId가 있을 때만 쿼리 실행
	});

	const records = query.data?.data?.content || [];
	
	return {
		data: query.data,
		isLoading: query.isLoading,
		error: query.error,
		refetch: query.refetch,
		// 편의를 위한 추가 속성들
		records,
		totalElements: query.data?.data?.totalElements || 0,
		totalPages: query.data?.data?.totalPages || 0,
	};
};
