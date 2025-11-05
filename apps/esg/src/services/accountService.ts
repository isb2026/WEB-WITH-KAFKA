import {
	FetchApiPost,
	FetchApiGet,
	FetchApiPut,
	FetchApiDelete,
	getSearchParams,
} from '@esg/utils/request';

import {
	GetAllAccountListPayload,
	GetSearchAccountListPayload,
	Account,
	CreateAccountPayload,
	UpdateAccountPayload,
} from '@esg/types/account';

export const getAllAccounts = async (payload: GetAllAccountListPayload) => {
	const { page = 0, size = 10, searchRequest } = payload;
	const searchParams = getSearchParams(searchRequest || {});
	const res = await FetchApiGet(
		`/account?page=${page}&size=${size}&${searchParams}`
	);
	if (res.status !== 'success') {
		throw new Error('관리항목 목록 조회 실패');
	}
	return res.data;
};

export const createAccount = async (data: CreateAccountPayload) => {
	const { accountStyleId, meterId, companyId, name, supplier, chargerId } =
		data;

	const cleanedParams = {
		accountStyleId,
		meterId,
		chargerId,
		companyId,
		name,
		supplier,
	};

	const res = await FetchApiPost('/account', cleanedParams);
	if (res.status !== 'success') {
		const errorMessage = res.errorMessage || '계정 생성 실패';
		throw new Error(errorMessage);
	}
	return res.data;
};

export const updateAccount = async (id: number, data: UpdateAccountPayload) => {
	const { accountStyleId, meterId, companyId, name, supplier, isUse } = data;

	const cleanedParams = {
		accountStyleId,
		meterId,
		companyId,
		name,
		supplier,
		isUse,
	};

	const res = await FetchApiPut(`/account/${id}`, cleanedParams);
	if (res.status !== 'success') {
		const errorMessage = res.errorMessage || '계정 수정 실패';
		throw new Error(errorMessage);
	}
	return res.data;
};

export const deleteAccount = async (id: number) => {
	const res = await FetchApiDelete(`/account/${id}`);
	if (res.status !== 'success') {
		const errorMessage = res.errorMessage || '계정 삭제 실패';
		throw new Error(errorMessage);
	}
	return res.data;
};

export const searchAccounts = async (payload: GetSearchAccountListPayload) => {
	const res = await FetchApiGet('/account/search', payload);
	if (res.status !== 'success') {
		throw new Error('계정 검색 실패');
	}
	return res.data;
};

export const getAccountFieldValues = async (
	fieldName: string,
	searchRequest: Partial<GetSearchAccountListPayload['searchRequest']> = {}
) => {
	const res = await FetchApiGet(`/account/fields/${fieldName}`, {
		searchRequest,
	});
	if (res.status !== 'success') {
		const errorMessage = res.errorMessage || '필드 조회 실패';
		throw new Error(errorMessage);
	}
	return res.data;
};

// Deprecated: Use getAllAccounts with searchRequest instead of company-based path
export const getAccountsByFilter = async (
	payload: GetAllAccountListPayload
) => {
	const { page = 0, size = 10, searchRequest } = payload;
	const searchParams = getSearchParams(searchRequest || {});
	const res = await FetchApiGet(
		`/account?page=${page}&size=${size}&${searchParams}`
	);
	if (res.status !== 'success') {
		const errorMessage = res.errorMessage || '계정 목록 조회 실패';
		throw new Error(errorMessage);
	}
	return res.data;
};

export const getAccountDetail = async (id: number) => {
	if (id < 1) return false;
	const res = await FetchApiGet(`/account/${id}`);
	if (res.status !== 'success') {
		const errorMessage = res.errorMessage || '사업장 상세 조회 실패';
		throw new Error(errorMessage);
	}
	return res.data;
};
