// Working 관련 원자적 Hook들을 import
import { useWorkingListQuery } from './useWorkingListQuery';
import { useCreateWorking } from './useCreateWorking';
import { useUpdateWorking } from './useUpdateWorking';
import { useDeleteWorking } from './useDeleteWorking';
import {
	useWorkingDetailListQuery,
	useWorkingDetailByMasterIdQuery,
} from './useWorkingDetailListQuery';
import { useCreateWorkingDetail } from './useCreateWorkingDetail';
import { useUpdateWorkingDetail } from './useUpdateWorkingDetail';
import { useDeleteWorkingDetail } from './useDeleteWorkingDetail';
import {
	WorkingListParams,
	WorkingDetailListParams,
} from '@primes/services/production/workingService';

// Composite Hook: Working (excludes field hook)
export const useWorking = (params: WorkingListParams) => {
	const list = useWorkingListQuery(params);
	const create = useCreateWorking();
	const update = useUpdateWorking();
	const remove = useDeleteWorking();

	return { list, create, update, remove };
};

// Master-Detail Hook: Working Master
export const useWorkingMaster = (params: WorkingListParams) => {
	const masterList = useWorkingListQuery(params);
	const createMaster = useCreateWorking();
	const updateMaster = useUpdateWorking();
	const deleteMaster = useDeleteWorking();

	return {
		masterList,
		createMaster,
		updateMaster,
		deleteMaster,
	};
};

// Master-Detail Hook: Working Detail
export const useWorkingDetail = (masterId?: number) => {
	const detailList = useWorkingDetailByMasterIdQuery(
		masterId || 0,
		!!masterId
	);
	const createDetail = useCreateWorkingDetail();
	const updateDetail = useUpdateWorkingDetail();
	const deleteDetail = useDeleteWorkingDetail();

	return {
		detailList,
		createDetail,
		updateDetail,
		deleteDetail,
	};
};
