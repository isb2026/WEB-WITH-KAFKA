import {
	FetchApiPost,
	FetchApiGet,
	FetchApiPut,
	FetchApiDelete,
} from '@primes/utils/request';
import { GetAllItemsVendorListPayload } from '@primes/types/purchase/itemsVendor';
import { GetSearchItemsVendorListPayload } from '@primes/types/purchase/itemsVendor';
import {
	CreateItemsVendorPayload,
	UpdateItemsVendorPayload,
} from '@primes/types/purchase/itemsVendor';

export const getAllItemsVendorList = async (
	payload: GetAllItemsVendorListPayload
) => {
	const res = await FetchApiGet('/purchase/items-vendor', payload);
	if (res.status !== 'success') {
		throw new Error('목록 조회 실패');
	}
	return res.data;
};

export const createItemsVendor = async (data: CreateItemsVendorPayload[]) => {
	const res = await FetchApiPost('/purchase/items-vendor', data);
	if (res.status !== 'success') {
		throw new Error('생성 실패');
	}
	return res.data;
};

export const updateItemsVendor = async (data: UpdateItemsVendorPayload[]) => {
	const res = await FetchApiPut('/purchase/items-vendor', data);
	if (res.status !== 'success') {
		throw new Error('수정 실패');
	}
	return res.data;
};

export const updateItemsVendorById = async (
	id: number,
	data: UpdateItemsVendorPayload
) => {
	// Use bulk update endpoint with single item array
	const updateData = [{ id, ...data }];
	const res = await FetchApiPut('/purchase/items-vendor', updateData);
	if (res.status !== 'success') {
		throw new Error('수정 실패');
	}
	return res.data;
};

export const deleteItemsVendor = async (ids: number[]) => {
	const res = await FetchApiDelete(`/purchase/items-vendor`, undefined, ids);
	if (res.status !== 'success') {
		throw new Error('삭제 실패');
	}
	return res.data;
};

export const searchItemsVendor = async (
	payload: GetSearchItemsVendorListPayload
) => {
	const res = await FetchApiGet('/purchase/items-vendor/search', payload);
	if (res.status !== 'success') {
		throw new Error('검색 실패');
	}
	return res.data;
};

export const getItemsVendorFieldName = async (fieldName: string) => {
	const res = await FetchApiGet(`/purchase/item-vendor/fields/${fieldName}`);
	if (res.status !== 'success') {
		throw new Error('필드 조회 실패');
	}
	return res.data;
};

export const searchItemsVendorFields = async (fieldName: string, searchParams: any) => {
	const res = await FetchApiGet(`/purchase/item-vendor/fields/${fieldName}`, searchParams);
	if (res.status !== 'success') {
		throw new Error('필드 검색 실패');
	}
	return res.data;
};
