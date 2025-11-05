import {
	FetchApiPost,
	FetchApiGet,
	FetchApiPut,
	FetchApiDelete,
} from '@primes/utils/request';
import apiClient from '@primes/utils/apiClient';
import { GetAllPurchaseMasterListPayload } from '@primes/types/purchase/purchaseMaster';
import { GetSearchPurchaseMasterListPayload } from '@primes/types/purchase/purchaseMaster';
import {
	CreatePurchaseMasterPayload,
	UpdatePurchaseMasterPayload,
} from '@primes/types/purchase/purchaseMaster';

export const getAllPurchaseMasterList = async (
	payload: GetAllPurchaseMasterListPayload
) => {
	const res = await FetchApiGet('/purchase/purchase/master', payload);
	if (res.status !== 'success') {
		throw new Error('구매입고 마스터 목록 조회 실패');
	}
	return res.data;
};

export const createPurchaseMaster = async (
	data: any
) => {
	try {
		const response = await FetchApiPost('/purchase/purchase/master', data);
		return response.data;
	} catch (error: any) {
		console.error('Purchase master creation failed:', error.message);
		console.error('Error response:', error.response?.data);
		throw error;
	}
};

export const updatePurchaseMaster = async (
	id: number,
	data: Partial<UpdatePurchaseMasterPayload>
) => {
	try {
		const response = await FetchApiPut(`/purchase/purchase/master/${id}`, data);
		return response.data;
	} catch (error: any) {
		console.error('Purchase master update failed:', error.message);
		console.error('Error response:', error.response?.data);
		throw error;
	}
};

export const deletePurchaseMaster = async (ids: number[]) => {
	const res = await FetchApiDelete(
		`/purchase/purchase/master`,
		undefined,
		ids
	);
	if (res.status !== 'success') {
		throw new Error('구매입고 마스터 삭제 실패');
	}
	return res.data;
};

export const searchPurchaseMaster = async (
	payload: GetSearchPurchaseMasterListPayload
) => {
	const res = await FetchApiGet('/purchase/purchase/master/search', payload);
	if (res.status !== 'success') {
		throw new Error('구매입고 마스터 검색 실패');
	}
	return res.data;
};

export const getPurchaseMasterById = async (params: {
	id: number;
	page: number;
	size: number;
}) => {
	const res = await FetchApiGet('/purchase/purchase/master', params);
	if (res.status !== 'success') {
		throw new Error('구매입고 마스터 조회 실패');
	}
	return res.data;
};

export const getPurchaseMasterFieldName = async (fieldName: string) => {
	const res = await FetchApiGet(
		`/purchase/purchase/master/fields/${fieldName}`
	);
	if (res.status !== 'success') {
		throw new Error('구매입고 마스터 필드 조회 실패');
	}
	return res.data;
};
