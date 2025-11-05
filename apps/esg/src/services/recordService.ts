import {
	FetchApiPost,
	FetchApiGet,
	FetchApiPut,
	FetchApiDelete,
	getSearchParams,
} from '@esg/utils/request';

import {
	GetAllRecordListPayload,
	GetSearchRecordListPayload,
	Record,
	CreateRecordPayload,
	UpdateRecordPayload,
} from '@esg/types/record';

export const getAllRecords = async (payload: GetAllRecordListPayload) => {
	const { page = 0, size = 10, searchRequest } = payload;
	const searchParams = getSearchParams(searchRequest || {});
	const res = await FetchApiGet(
		`/record?page=${page}&size=${size}&${searchParams}`
	);
	if (res.status !== 'success') {
		throw new Error('레코드 목록 조회 실패');
	}
	return res.data;
};

export const createRecord = async (payload: Partial<CreateRecordPayload>) => {
	const {
		accountId,
		accountMonth,
		quantity,
		totalCost,
		reference,
		invoiceOn,
		invoiceMemo,
		amountToPay,
		payableOn,
		paidOn,
	} = payload;
	if (!accountId) return false;
	const cleanedParams: CreateRecordPayload = Object.fromEntries(
		Object.entries({
			accountId,
			accountMonth,
			quantity,
			totalCost,
			reference,
			invoiceOn,
			invoiceMemo,
			amountToPay,
			payableOn,
			paidOn,
		}).filter(([_, v]) => v !== undefined)
	);

	const res = await FetchApiPost('/record', cleanedParams);
	if (res.status !== 'success') {
		const errorMessage = res.errorMessage || '레코드 생성 실패';
		throw new Error(errorMessage);
	}
	return res.data;
};

export const updateRecord = async (
	id: number,
	data: Partial<UpdateRecordPayload>
) => {
	const {
		startPeriod,
		endPeriod,
		quantity,
		totalCost,
		reference,
		invoiceOn,
		invoiceMemo,
		amountToPay,
		payableOn,
		paidOn,
	} = data;

	const cleanedParams: CreateRecordPayload = Object.fromEntries(
		Object.entries({
			startPeriod,
			endPeriod,
			quantity,
			totalCost,
			reference,
			invoiceOn,
			invoiceMemo,
			amountToPay,
			payableOn,
			paidOn,
		}).filter(([_, v]) => v !== undefined)
	);
	const res = await FetchApiPut(`/record/${id}`, cleanedParams);
	if (res.status !== 'success') {
		const errorMessage = res.errorMessage || '레코드 수정 실패';
		throw new Error(errorMessage);
	}
	return res.data;
};

export const deleteRecord = async (id: number) => {
	const res = await FetchApiDelete(`/record/${id}`);
	if (res.status !== 'success') {
		const errorMessage = res.errorMessage || '레코드 삭제 실패';
		throw new Error(errorMessage);
	}
	return res.data;
};

export const getRecordsByCompanyId = async (
	companyId: number,
	page: number = 0,
	size: number = 10
) => {
	const res = await FetchApiGet(`/record/company/${companyId}?page=${page}&size=${size}`);
	if (res.status !== 'success') {
		const errorMessage = res.errorMessage || '회사별 레코드 조회 실패';
		throw new Error(errorMessage);
	}
	return res.data;
};

export const getRecordFieldValues = async (fieldName: string, payload: any = {}) => {
	const res = await FetchApiPost(`/record/fields/${fieldName}`, payload);
	if (res.status !== 'success') {
		const errorMessage = res.errorMessage || '레코드 필드 조회 실패';
		throw new Error(errorMessage);
	}
	return res.data;
};
