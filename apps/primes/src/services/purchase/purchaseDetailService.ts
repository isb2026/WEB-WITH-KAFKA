import {
	FetchApiPost,
	FetchApiGet,
	FetchApiPut,
	FetchApiDelete,
} from '@primes/utils/request';
import apiClient from '@primes/utils/apiClient';
import { GetAllPurchaseDetailListPayload } from '@primes/types/purchase/purchaseDetail';
import { GetSearchPurchaseDetailListPayload } from '@primes/types/purchase/purchaseDetail';
import {
	CreatePurchaseDetailPayload,
	UpdatePurchaseDetailPayload,
} from '@primes/types/purchase/purchaseDetail';

export const getAllPurchaseDetailList = async (
	payload: GetAllPurchaseDetailListPayload
) => {
	const res = await FetchApiGet('/purchase/purchase/detail', payload);
	if (res.status !== 'success') {
		throw new Error('주문 상세 목록 조회 실패');
	}
	return res.data;
};

export const createPurchaseDetail = async (
	data: CreatePurchaseDetailPayload[] | { dataList: CreatePurchaseDetailPayload[] }
) => {
	// Handle both array format and dataList wrapper format
	let payload: CreatePurchaseDetailPayload[];
	if (Array.isArray(data)) {
		payload = data;
	} else if (data.dataList && Array.isArray(data.dataList)) {
		payload = data.dataList;
	} else {
		throw new Error('Invalid data format for purchase detail creation');
	}
	
	// ✅ FIXED: Ensure payload matches exact API structure
	const cleanPayload = payload.map(item => ({
		purchaseMasterId: item.purchaseMasterId,
		itemId: item.itemId || 0,
		itemNo: item.itemNo || 0,
		itemNumber: item.itemNumber || '',
		itemName: item.itemName || '',
		itemSpec: item.itemSpec || '',
		unit: item.unit || '',
		number: item.number || 0,
		currencyUnit: item.currencyUnit || '',
		unitPrice: item.unitPrice || 0,
		netPrice: item.netPrice || 0,
		grossPrice: item.grossPrice || 0,
		requestDate: item.requestDate || '',
		vat: item.vat || 0,
	}));
	
	try {
		const response = await FetchApiPost('/purchase/purchase/detail', cleanPayload);
		return response.data;
	} catch (error: any) {
		console.error('Purchase detail creation failed:', error.message);
		console.error('Error response:', error.response?.data);
		throw error;
	}
};

export const updatePurchaseDetail = async (
	id: number,
	data: Partial<UpdatePurchaseDetailPayload>
) => {
	const res = await FetchApiPut(`/purchase/purchase/detail/${id}`, data);
	if (res.status !== 'success') {
		throw new Error('주문 상세 수정 실패');
	}
	return res.data;
};

export const updateAllPurchaseDetail = async (
	data: (UpdatePurchaseDetailPayload & { id: number })[]
) => {
	try {
		const response = await FetchApiPut('/purchase/purchase/detail/updateAll', data);
		return response.data;
	} catch (error: any) {
		console.error('Purchase detail update all failed:', error.message);
		console.error('Error response:', error.response?.data);
		throw error;
	}
};

export const deletePurchaseDetail = async (ids: number[]) => {
	const res = await FetchApiDelete(
		`/purchase/purchase/detail`,
		undefined,
		ids
	);
	if (res.status !== 'success') {
		throw new Error('주문 상세 삭제 실패');
	}
	return res.data;
};

export const searchPurchaseDetail = async (
	payload: GetSearchPurchaseDetailListPayload
) => {
	const res = await FetchApiGet('/purchase/purchase/detail/search', payload);
	if (res.status !== 'success') {
		throw new Error('주문 상세 검색 실패');
	}
	return res.data;
};

export const getPurchaseDetailFieldName = async (fieldName: string) => {
	const res = await FetchApiGet(
		`/purchase/purchase/detail/fields/${fieldName}`
	);
	if (res.status !== 'success') {
		throw new Error('주문 상세 필드 조회 실패');
	}
	return res.data;
};

export const getPurchaseDetailListByMasterId = async (
	purchaseMasterId: number,
	page: number = 0,
	size: number = 10
) => {
	const res = await FetchApiGet('/purchase/purchase/detail', {
		purchaseMasterId,
		page,
		size,
	});
	if (res.status !== 'success') {
		throw new Error(`구매 ID ${purchaseMasterId}의 상세 목록 조회 실패`);
	}
	return res.data;
};
