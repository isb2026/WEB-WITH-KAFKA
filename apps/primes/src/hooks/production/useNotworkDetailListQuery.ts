import { useQuery, keepPreviousData } from '@tanstack/react-query';
import {
	getNotworkDetailList,
	getNotworkDetailByMasterId,
} from '@primes/services/production/notworkService';
import { NotworkDetailListParams } from '@primes/types/production/notwork';

/**
 * 비가동 Detail 목록 조회 전용 Atomic Hook
 */
export const useNotworkDetailListQuery = (params: NotworkDetailListParams) => {
	return useQuery({
		queryKey: ['notwork-detail', params],
		queryFn: () =>
			getNotworkDetailList(params, params.page || 0, params.size || 10),
		placeholderData: keepPreviousData,
		staleTime: 1000 * 60 * 3, // 3분간 캐시 유지
	});
};

/**
 * 비가동 Detail 마스터별 조회 전용 Atomic Hook (Master-Detail 패턴)
 */
export const useNotworkDetailByMasterIdQuery = (
	masterId: number,
	page: number = 0,
	size: number = 10,
	enabled = true
) => {
	return useQuery({
		queryKey: ['notwork-detail', 'byMasterId', masterId, page, size],
		queryFn: () => getNotworkDetailByMasterId(masterId, page, size),
		placeholderData: keepPreviousData,
		staleTime: 1000 * 60 * 3, // 3분간 캐시 유지
		enabled: enabled && !!masterId,
	});
};
