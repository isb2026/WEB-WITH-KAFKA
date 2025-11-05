import {
	FetchApiPost,
	FetchApiGet,
	FetchApiPut,
	FetchApiDelete,
} from '@primes/utils/request';

// Codes Master API calls
export const getCodesList = async (
	searchRequest: any = {},
	page: number = 0,
	size: number = 10
) => {
	const res = await FetchApiGet('/ini/codes', {
		searchRequest,
		page,
		size,
	});
	if (res.status !== 'success') {
		throw new Error('Codes 목록 조회 실패');
	}
	return res.data;
};

export const createCodes = async (data: any) => {
	const res = await FetchApiPost('/ini/codes', data);
	if (res.status !== 'success') {
		throw new Error('Codes 생성 실패');
	}
	return res.data;
};

export const updateCodes = async (id: number, data: any) => {
	const res = await FetchApiPut(`/ini/codes/${id}`, data);
	if (res.status !== 'success') {
		throw new Error('Codes 수정 실패');
	}
	return res.data;
};

export const deleteCodes = async (ids: number[]) => {
	const res = await FetchApiDelete('/ini/codes', ids);
	if (res.status !== 'success') {
		throw new Error('Codes 삭제 실패');
	}
	return res.data;
};