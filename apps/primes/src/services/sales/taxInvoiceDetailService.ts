import {
	FetchApiPost,
	FetchApiGet,
	FetchApiPut,
	FetchApiDelete,
} from '@primes/utils/request';
import { GetAllTaxInvoiceDetailListPayload } from '@primes/types/sales/taxInvoiceDetail';
import { GetSearchTaxInvoiceDetailListPayload } from '@primes/types/sales/taxInvoiceDetail';
import {
	CreateTaxInvoiceDetailPayload,
	UpdateTaxInvoiceDetailPayload,
} from '@primes/types/sales/taxInvoiceDetail';

export const getAllTaxInvoiceDetailList = async (
	payload: GetAllTaxInvoiceDetailListPayload
) => {
	const res = await FetchApiGet('/sales/tax-invoice/detail', payload);
	if (res.status !== 'success') {
		throw new Error('세금계산서 상세 목록 조회 실패');
	}
	return res.data;
};

export const createTaxInvoiceDetail = async (
	data: CreateTaxInvoiceDetailPayload[]
) => {
	const res = await FetchApiPost('/sales/tax-invoice/detail', data);
	if (res.status !== 'success') {
		throw new Error('세금계산서 상세 생성 실패');
	}
	return res.data;
};

export const updateTaxInvoiceDetail = async (
	id: number,
	data: Partial<UpdateTaxInvoiceDetailPayload>
) => {
	const res = await FetchApiPut(`/sales/tax-invoice/detail/${id}`, data);
	if (res.status !== 'success') {
		throw new Error('세금계산서 상세 수정 실패');
	}
	return res.data;
};

export const deleteTaxInvoiceDetail = async (ids: number[]) => {
	const res = await FetchApiDelete(`/sales/tax-invoice/detail`, undefined, ids);
	if (res.status !== 'success') {
		throw new Error('세금계산서 상세 삭제 실패');
	}
	return res.data;
};

export const searchTaxInvoiceDetail = async (
	payload: GetSearchTaxInvoiceDetailListPayload
) => {
	const res = await FetchApiGet('/sales/tax-invoice/detail/search', payload);
	if (res.status !== 'success') {
		throw new Error('세금계산서 상세 검색 실패');
	}
	return res.data;
};

export const getTaxInvoiceDetailFieldName = async (fieldName: string) => {
	const res = await FetchApiGet(
		`/sales/tax-invoice/detail/fields/${fieldName}`
	);
	if (res.status !== 'success') {
		throw new Error('세금계산서 상세 필드 조회 실패');
	}
	return res.data;
};

export const getTaxInvoiceDetailByMasterId = async (
	masterId: number,
	page: number,
	size: number
) => {
	const res = await FetchApiGet('/sales/tax-invoice/detail', {
		taxInvoiceMasterId: masterId,
		page,
		size,
	});
	if (res.status !== 'success') {
		throw new Error(`세금계산서 ID ${masterId}의 상세 목록 조회 실패`);
	}
	return res.data;
};
