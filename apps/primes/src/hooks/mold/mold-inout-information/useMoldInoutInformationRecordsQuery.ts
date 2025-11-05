import { useQuery, keepPreviousData } from '@tanstack/react-query';
import { getMoldInoutInformationRecords } from '@primes/services/mold/moldInoutInformationService';

export const useMoldInoutInformationRecordsQuery = (params: { 
	outCommandId?: number;
	page: number; 
	size: number; 
	inoutFlag?: boolean;
}) => {
	return useQuery({
		queryKey: ['moldInoutInformationRecords', params.outCommandId, params.page, params.size, params.inoutFlag],
		queryFn: () => getMoldInoutInformationRecords(params.outCommandId, params.page, params.size, params.inoutFlag),
		placeholderData: keepPreviousData,
		staleTime: 1000 * 60 * 3,
		enabled: !!params.outCommandId, // outCommandId가 있을 때만 쿼리 실행
	});
};