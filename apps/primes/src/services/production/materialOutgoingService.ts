import {
	FetchApiPost,
	FetchApiGet,
	FetchApiPut,
	FetchApiDelete,
} from '@primes/utils/request';

// MaterialOutgoing Master API calls
export const getMaterialOutgoingList = async (
	searchRequest: any = {},
	page: number = 0,
	size: number = 10
) => {
	const res = await FetchApiGet('/production/material-outgoing', {
		searchRequest,
		page,
		size,
	});
	if (res.status !== 'success') {
		throw new Error('MaterialOutgoing 목록 조회 실패');
	}
	return res.data;
};

export const createMaterialOutgoing = async (data: any) => {
	const res = await FetchApiPost('/production/material-outgoing', data);
	if (res.status !== 'success') {
		throw new Error('MaterialOutgoing 생성 실패');
	}
	return res.data;
};

export const updateMaterialOutgoing = async (id: number, data: any) => {
	const res = await FetchApiPut(`/production/material-outgoing/${id}`, data);
	if (res.status !== 'success') {
		throw new Error('MaterialOutgoing 수정 실패');
	}
	return res.data;
};

export const deleteMaterialOutgoing = async (ids: number[]) => {
	const res = await FetchApiDelete('/production/material-outgoing', ids);
	if (res.status !== 'success') {
		throw new Error('MaterialOutgoing 삭제 실패');
	}
	return res.data;
};