import { useQuery, keepPreviousData } from '@tanstack/react-query';
import { getCommandProgressList } from '@primes/services/production/commandProgressService';
import type { CommandProgressSearchRequest } from '@primes/types/production/commandProgressTypes';

interface CommandProgressListParams {
	page?: number;
	size?: number;
	searchRequest?: CommandProgressSearchRequest;
	enabled?: boolean; // ✅ enabled 옵션 추가
}

export const useCommandProgressListQuery = (params: CommandProgressListParams = {}) => {
	const { page = 0, size = 10, searchRequest = {}, enabled = true } = params; // ✅ enabled 기본값 true

	return useQuery({
		queryKey: ['commandProgress', page, size, searchRequest],
		queryFn: () => getCommandProgressList(searchRequest, page, size),
		placeholderData: keepPreviousData,
		staleTime: 1000 * 60 * 3, // 3분
		enabled: enabled, // ✅ enabled 옵션 적용
	});
}; 