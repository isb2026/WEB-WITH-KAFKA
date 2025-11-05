// Notwork Master 관련 원자적 Hook들을 import
import { useNotworkMasterListQuery } from './useNotworkMasterListQuery';
import { useNotworkMasterByIdQuery } from './useNotworkMasterByIdQuery';
import {
	useCreateNotworkMaster,
	useCreateNotworkMasterBatch,
} from './useCreateNotworkMaster';
import { useUpdateNotworkMaster } from './useUpdateNotworkMaster';
import { useDeleteNotworkMaster } from './useDeleteNotworkMaster';
import { NotworkMasterListParams } from '@primes/types/production/notwork';

/**
 * 비가동 Master Composite Hook (Field API 제외)
 * 일반적인 CRUD 작업을 위한 통합 인터페이스
 */
export const useNotworkMaster = (params: NotworkMasterListParams) => {
	const list = useNotworkMasterListQuery(params);
	const create = useCreateNotworkMaster();
	const createBatch = useCreateNotworkMasterBatch();
	const update = useUpdateNotworkMaster();
	const remove = useDeleteNotworkMaster();

	return {
		list,
		create,
		createBatch,
		update,
		remove,
	};
};

/**
 * 비가동 Master 개별 조회 Hook
 */
export const useNotworkMasterById = (id: number, enabled?: boolean) => {
	return useNotworkMasterByIdQuery(id, enabled);
};
