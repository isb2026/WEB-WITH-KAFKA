import {
	FetchApiPost,
	FetchApiGet,
	FetchApiPut,
	FetchApiDelete,
} from '@primes/utils/request';

// Estimate Master API calls
export const getEstimateList = async (
	searchRequest: any = {},
	page: number = 0,
	size: number = 10
) => {
	const res = await FetchApiGet('/sales/estimate', {
		searchRequest,
		page,
		size,
	});
	if (res.status !== 'success') {
		throw new Error('Estimate 목록 조회 실패');
	}
	return res.data;
};

export const createEstimate = async (data: any) => {
	const res = await FetchApiPost('/sales/estimate', data);
	if (res.status !== 'success') {
		throw new Error('Estimate 생성 실패');
	}
	return res.data;
};

export const updateEstimate = async (id: number, data: any) => {
	const res = await FetchApiPut(`/sales/estimate/${id}`, data);
	if (res.status !== 'success') {
		throw new Error('Estimate 수정 실패');
	}
	return res.data;
};

export const deleteEstimate = async (ids: number[]) => {
	const res = await FetchApiDelete('/sales/estimate', ids);
	if (res.status !== 'success') {
		throw new Error('Estimate 삭제 실패');
	}
	return res.data;
};

// Estimate Detail API calls
export const getEstimateDetailList = async (
	searchRequest: any = {},
	page: number = 0,
	size: number = 10
) => {
	const res = await FetchApiGet('/sales/estimate/detail', {
		searchRequest,
		page,
		size,
	});
	if (res.status !== 'success') {
		throw new Error('Estimate 상세 목록 조회 실패');
	}
	return res.data;
};

export const getEstimateDetailByMasterId = async (
	masterId: number,
	page: number = 0,
	size: number = 10
) => {
	const res = await FetchApiGet('/sales/estimate/detail', {
		searchRequest: { masterId },
		page,
		size,
	});
	if (res.status !== 'success') {
		throw new Error(`Estimate ID ${masterId}의 상세 목록 조회 실패`);
	}
	return res.data;
};

export const createEstimateDetail = async (data: any) => {
	const res = await FetchApiPost('/sales/estimate/detail', data);
	if (res.status !== 'success') {
		throw new Error('Estimate 상세 생성 실패');
	}
	return res.data;
};

export const updateEstimateDetail = async (id: number, data: any) => {
	const res = await FetchApiPut(`/sales/estimate/detail/${id}`, data);
	if (res.status !== 'success') {
		throw new Error('Estimate 상세 수정 실패');
	}
	return res.data;
};

export const deleteEstimateDetail = async (ids: number[]) => {
	const res = await FetchApiDelete('/sales/estimate/detail', ids);
	if (res.status !== 'success') {
		throw new Error('Estimate 상세 삭제 실패');
	}
	return res.data;
};