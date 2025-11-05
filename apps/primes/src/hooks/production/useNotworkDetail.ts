// Notwork Detail 관련 원자적 Hook들을 import
import {
	useNotworkDetailListQuery,
	useNotworkDetailByMasterIdQuery,
} from './useNotworkDetailListQuery';
import { useNotworkDetailByIdQuery } from './useNotworkDetailByIdQuery';
import {
	useCreateNotworkDetail,
	useCreateNotworkDetailBatch,
} from './useCreateNotworkDetail';
import { useUpdateNotworkDetail } from './useUpdateNotworkDetail';
import { useDeleteNotworkDetail } from './useDeleteNotworkDetail';
import { NotworkDetailListParams } from '@primes/types/production/notwork';

/**
 * 비가동 Detail Composite Hook (Field API 제외)
 * 일반적인 CRUD 작업을 위한 통합 인터페이스
 */
export const useNotworkDetail = (params: NotworkDetailListParams) => {
	const list = useNotworkDetailListQuery(params);
	const create = useCreateNotworkDetail();
	const createBatch = useCreateNotworkDetailBatch();
	const update = useUpdateNotworkDetail();
	const remove = useDeleteNotworkDetail();

	return {
		list,
		create,
		createBatch,
		update,
		remove,
	};
};

/**
 * 비가동 Detail 마스터별 조회 Hook (Master-Detail 패턴용)
 */
export const useNotworkDetailByMasterId = (
	masterId: number,
	page?: number,
	size?: number,
	enabled?: boolean
) => {
	return useNotworkDetailByMasterIdQuery(masterId, page, size, enabled);
};

/**
 * 비가동 Detail 개별 조회 Hook
 */
export const useNotworkDetailById = (id: number, enabled?: boolean) => {
	return useNotworkDetailByIdQuery(id, enabled);
};
