import {
	FetchApiPost,
	FetchApiGet,
	FetchApiPut,
	FetchApiDelete,
	getSearchParams,
} from '@primes/utils/request';
import { GetAllIncomingMasterListPayload } from '@primes/types/purchase/incomingMaster';
import { GetSearchIncomingMasterListPayload } from '@primes/types/purchase/incomingMaster';
import {
	CreateIncomingMasterPayload,
	UpdateIncomingMasterPayload,
} from '@primes/types/purchase/incomingMaster';

export const getAllIncomingMasterList = async (
	payload: GetAllIncomingMasterListPayload
) => {
	const res = await FetchApiGet('/purchase/incoming/master', payload);
	if (res.status !== 'success') {
		throw new Error('구매입고 마스터 목록 조회 실패');
	}
	return res.data;
};

export const createIncomingMaster = async (
	data: Partial<CreateIncomingMasterPayload>
) => {
	// Send data as single object (not array) as expected by backend
	const res = await FetchApiPost('/purchase/incoming/master', data);
	if (res.status !== 'success') {
		throw new Error('구매입고 마스터 생성 실패');
	}
	return res.data;
};

export const updateIncomingMaster = async (
	id: number,
	data: Partial<UpdateIncomingMasterPayload>
) => {
	const res = await FetchApiPut(`/purchase/incoming/master/${id}`, data);
	if (res.status !== 'success') {
		throw new Error('구매입고 마스터 수정 실패');
	}
	return res.data;
};

export const deleteIncomingMaster = async (ids: number[]) => {
	const res = await FetchApiDelete(
		`/purchase/incoming/master`,
		undefined,
		ids
	);
	if (res.status !== 'success') {
		throw new Error('구매입고 마스터 삭제 실패');
	}
	return res.data;
};

export const searchIncomingMaster = async (
	payload: GetSearchIncomingMasterListPayload
) => {
	const searchParams = getSearchParams(payload.searchRequest);
	const res = await FetchApiGet(`/purchase/incoming/master?${searchParams}`);
	if (res.status !== 'success') {
		throw new Error('구매입고 마스터 검색 실패');
	}
	return res.data;
};

export const getIncomingMasterFieldName = async (fieldName: string) => {
	const res = await FetchApiGet(
		`/purchase/incoming/master/fields/${fieldName}`
	);
	if (res.status !== 'success') {
		throw new Error('구매입고 마스터 필드 조회 실패');
	}
	return res.data;
};

export const getIncomingMasterById = async (payload: {
	id: number;
	page: number;
	size: number;
}) => {
	const res = await FetchApiGet('/purchase/incoming/master', payload);
	if (res.status !== 'success') {
		throw new Error('구매입고 마스터 조회 실패');
	}
	return res.data;
};
