import {
	FetchApiPost,
	FetchApiGet,
	FetchApiPut,
	FetchApiDelete,
	getSearchParams,
} from '@primes/utils/request';
import { PlanMaster, PlanSearchRequest } from '@primes/types/production';

// Plan API calls
export const getPlanList = async (
	searchRequest: PlanSearchRequest = {},
	page: number = 0,
	size: number = 10
) => {
	const res = await FetchApiGet('/production/plan', {
		searchRequest,
		page,
		size,
	});
	if (res.status !== 'success') {
		const errorMessage = res.errorMessage || '생산 계획 목록 조회 실패';
		throw new Error(errorMessage);
	}
	return res.data;
};


export const getPlanById = async (id: number): Promise<PlanMaster> => {
	const res = await FetchApiGet(`/production/plan?id=${id}`);
	if (res.status !== 'success') {
		const errorMessage = res.errorMessage || '생산 계획 조회 실패';
		throw new Error(errorMessage);
	}
	return res.data;
};

export const createPlan = async (data: any) => {
	const res = await FetchApiPost('/production/plan', data);
	if (res.status !== 'success') {
		throw new Error('생산 계획 생성 실패');
	}
	return res.data;
};

export const updatePlan = async (id: number, data: any) => {
	const res = await FetchApiPut(`/production/plan/${id}`, data);
	if (res.status !== 'success') {
		throw new Error('생산 계획 수정 실패');
	}
	return res.data;
};

export const deletePlan = async (ids: number[]) => {
	const res = await FetchApiDelete(`/production/plan`, undefined, ids);
	if (res.status !== 'success') {
		throw new Error('생산 계획 삭제 실패');
	}
	return res.data;
};

// Field API for Machine Part
export const getPlanFields = async (fieldName: string) => {
	const res = await FetchApiGet(`/production/plan/fields/${fieldName}`);
	if (res.status !== 'success') {
		const errorMessage = res.errorMessage || 'Plan 필드 조회 실패';
		throw new Error(errorMessage);
	}
	return res.data;
};
