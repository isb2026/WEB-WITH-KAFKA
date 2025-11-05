import {
	FetchApiPost,
	FetchApiGet,
	FetchApiPut,
	FetchApiDelete,
} from '@primes/utils/request';
import { GetAllItemPriceHistoryListPayload } from '@primes/types/purchase/itemPriceHistory';
import { GetSearchItemPriceHistoryListPayload } from '@primes/types/purchase/itemPriceHistory';
import {
	CreateItemPriceHistoryPayload,
	UpdateItemPriceHistoryPayload,
} from '@primes/types/purchase/itemPriceHistory';

export const getAllItemPriceHistoryList = async (
	payload: GetAllItemPriceHistoryListPayload
) => {
	const res = await FetchApiGet('/purchase/itempricehistory', payload);
	if (res.status !== 'success') {
		throw new Error('목록 조회 실패');
	}
	return res.data;
};

export const createItemPriceHistory = async (
	data: Partial<CreateItemPriceHistoryPayload>
) => {
	const res = await FetchApiPost('/purchase/itempricehistory', data);
	if (res.status !== 'success') {
		throw new Error('생성 실패');
	}
	return res.data;
};

export const updateItemPriceHistory = async (
	id: number,
	data: Partial<UpdateItemPriceHistoryPayload>
) => {
	const res = await FetchApiPut(`/purchase/itempricehistory/${id}`, data);
	if (res.status !== 'success') {
		throw new Error('수정 실패');
	}
	return res.data;
};

export const deleteItemPriceHistory = async (id: number) => {
	const res = await FetchApiDelete(`/purchase/itempricehistory/${id}`);
	if (res.status !== 'success') {
		throw new Error('삭제 실패');
	}
	return res.data;
};

export const searchItemPriceHistory = async (
	payload: GetSearchItemPriceHistoryListPayload
) => {
	const res = await FetchApiGet('/purchase/itempricehistory/search', payload);
	if (res.status !== 'success') {
		throw new Error('검색 실패');
	}
	return res.data;
};

export const getItemPriceHistoryFieldName = async (fieldName: string) => {
	const res = await FetchApiGet(
		`/purchase/itempricehistory/fields/${fieldName}`
	);
	if (res.status !== 'success') {
		throw new Error('필드 조회 실패');
	}
	return res.data;
};
