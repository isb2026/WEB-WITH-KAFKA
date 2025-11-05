import {
	FetchApiPost,
	FetchApiGet,
	FetchApiPut,
	FetchApiDelete,
} from '@primes/utils/request';
import {
	GetAllTaxInvoiceMasterListPayload,
	GetAllTaxInvoiceMasterListWithDetailPayload,
} from '@primes/types/sales/taxInvoiceMaster';
import { GetSearchTaxInvoiceMasterListPayload } from '@primes/types/sales/taxInvoiceMaster';
import {
	CreateTaxInvoiceMasterPayload,
	UpdateTaxInvoiceMasterPayload,
} from '@primes/types/sales/taxInvoiceMaster';

export const getAllTaxInvoiceMasterList = async (
	payload: GetAllTaxInvoiceMasterListPayload
) => {
	const res = await FetchApiGet('/sales/tax-invoice/master', payload);
	if (res.status !== 'success') {
		throw new Error('세금계산서 마스터 목록 조회 실패');
	}
	return res.data;
};

export const getAllTaxInvoiceMasterListWithDetail = async (
	payload: GetAllTaxInvoiceMasterListWithDetailPayload
) => {
	const res = await FetchApiGet(
		'/sales/tax-invoice/master/with-details',
		payload
	);
	if (res.status !== 'success') {
		throw new Error('세금계산서 목록 조회 실패');
	}
	return res.data;
};

export const createTaxInvoiceMaster = async (
	data: Partial<CreateTaxInvoiceMasterPayload>
) => {
	const res = await FetchApiPost('/sales/tax-invoice/master', data);
	if (res.status !== 'success') {
		throw new Error('세금계산서 마스터 생성 실패');
	}
	return res.data;
};

export const updateTaxInvoiceMaster = async (
	id: number,
	data: Partial<UpdateTaxInvoiceMasterPayload>
) => {
	// Ensure id is a number and handle large IDs
	const numericId = typeof id === 'string' ? parseInt(id, 10) : id;
	const res = await FetchApiPut(`/sales/tax-invoice/master/${numericId}`, data);
	if (res.status !== 'success') {
		throw new Error('세금계산서 마스터 수정 실패');
	}
	return res.data;
};

export const deleteTaxInvoiceMaster = async (ids: number[]) => {
	const res = await FetchApiDelete(`/sales/tax-invoice/master`, undefined, ids);
	if (res.status !== 'success') {
		throw new Error('세금계산서 마스터 삭제 실패');
	}
	return res.data;
};

export const searchTaxInvoiceMaster = async (
	payload: GetSearchTaxInvoiceMasterListPayload
) => {
	const res = await FetchApiGet('/sales/tax-invoice/master/search', payload);
	if (res.status !== 'success') {
		throw new Error('세금계산서 마스터 검색 실패');
	}
	return res.data;
};

export const getTaxInvoiceMasterFieldName = async (fieldName: string) => {
	const res = await FetchApiGet(
		`/sales/tax-invoice/master/fields/${fieldName}`
	);
	if (res.status !== 'success') {
		throw new Error('세금계산서 마스터 필드 조회 실패');
	}
	return res.data;
};

export const getTaxInvoiceMasterById = async (params: {
	id: number;
	page: number;
	size: number;
}) => {
	const res = await FetchApiGet('/sales/tax-invoice/master', params);
	if (res.status !== 'success') {
		throw new Error('세금계산서 마스터 조회 실패');
	}
	return res.data;
};
