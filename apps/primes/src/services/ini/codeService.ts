import {
	FetchApiPost,
	FetchApiGet,
	FetchApiPut,
	FetchApiDelete,
} from '@primes/utils/request';

// Code Master API calls
export const getCodeList = async (
	searchRequest: any = {},
	page: number = 0,
	size: number = 10
) => {
	const res = await FetchApiGet('/ini/code', {
		searchRequest,
		page,
		size,
	});
	if (res.status !== 'success') {
		throw new Error('Code 목록 조회 실패');
	}
	return res.data;
};

export const createCode = async (data: any) => {
	const res = await FetchApiPost('/ini/code', data);
	if (res.status !== 'success') {
		throw new Error('Code 생성 실패');
	}
	return res.data;
};

export const updateCode = async (id: number, data: any) => {
	const res = await FetchApiPut(`/ini/code/${id}`, data);
	if (res.status !== 'success') {
		throw new Error('Code 수정 실패');
	}
	return res.data;
};

export const deleteCode = async (ids: number[]) => {
	const res = await FetchApiDelete('/ini/code', ids);
	if (res.status !== 'success') {
		throw new Error('Code 삭제 실패');
	}
	return res.data;
};