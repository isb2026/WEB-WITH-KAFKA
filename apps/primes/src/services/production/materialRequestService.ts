import {
	FetchApiPost,
	FetchApiGet,
	FetchApiPut,
	FetchApiDelete,
} from '@primes/utils/request';

// MaterialRequest Master API calls
export const getMaterialRequestList = async (
	searchRequest: any = {},
	page: number = 0,
	size: number = 10
) => {
	const res = await FetchApiGet('/production/material-request', {
		searchRequest,
		page,
		size,
	});
	if (res.status !== 'success') {
		throw new Error('MaterialRequest 목록 조회 실패');
	}
	return res.data;
};

export const createMaterialRequest = async (data: any) => {
	const res = await FetchApiPost('/production/material-request', data);
	if (res.status !== 'success') {
		throw new Error('MaterialRequest 생성 실패');
	}
	return res.data;
};

export const updateMaterialRequest = async (id: number, data: any) => {
	const res = await FetchApiPut(`/production/material-request/${id}`, data);
	if (res.status !== 'success') {
		throw new Error('MaterialRequest 수정 실패');
	}
	return res.data;
};

export const deleteMaterialRequest = async (ids: number[]) => {
	const res = await FetchApiDelete('/production/material-request', ids);
	if (res.status !== 'success') {
		throw new Error('MaterialRequest 삭제 실패');
	}
	return res.data;
};