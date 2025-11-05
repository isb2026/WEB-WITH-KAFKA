import {
	FetchApiPost,
	FetchApiGet,
	FetchApiPut,
	FetchApiDelete,
} from '@primes/utils/request';

// Item Master API calls
export const getItemList = async (
	searchRequest: any = {},
	page: number = 0,
	size: number = 10
) => {
	const res = await FetchApiGet('/ini/item', {
		searchRequest,
		page,
		size,
	});
	if (res.status !== 'success') {
		throw new Error('Item 목록 조회 실패');
	}
	return res.data;
};

export const createItem = async (data: any) => {
	const res = await FetchApiPost('/ini/item', data);
	if (res.status !== 'success') {
		throw new Error('Item 생성 실패');
	}
	return res.data;
};

export const updateItem = async (id: number, data: any) => {
	const res = await FetchApiPut(`/ini/item/${id}`, data);
	if (res.status !== 'success') {
		throw new Error('Item 수정 실패');
	}
	return res.data;
};

export const deleteItem = async (ids: number[]) => {
	const res = await FetchApiDelete('/ini/item', ids);
	if (res.status !== 'success') {
		throw new Error('Item 삭제 실패');
	}
	return res.data;
};