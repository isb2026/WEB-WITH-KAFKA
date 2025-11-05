import {
	FetchApiPost,
	FetchApiGet,
	FetchApiPut,
	FetchApiDelete,
} from '@primes/utils/request';
import { GetAllStatementDetailListPayload } from '@primes/types/sales/statementDetail';
import { GetSearchStatementDetailListPayload } from '@primes/types/sales/statementDetail';
import {
	CreateStatementDetailPayload,
	UpdateStatementDetailPayload,
} from '@primes/types/sales/statementDetail';

export const getAllStatementDetailList = async (
	payload: GetAllStatementDetailListPayload
) => {
	const res = await FetchApiGet('/sales/statement/detail', payload);
	if (res.status !== 'success') {
		throw new Error('명세서 상세 목록 조회 실패');
	}
	return res.data;
};

export const createStatementDetail = async (
	data: any[]
) => {
	const res = await FetchApiPost('/sales/statement/detail', data);
	if (res.status !== 'success') {
		throw new Error('명세서 상세 생성 실패');
	}
	return res.data;
};

export const updateStatementDetail = async (
	id: number,
	data: Partial<UpdateStatementDetailPayload>
) => {
	const res = await FetchApiPut(`/sales/statement/detail/${id}`, data);
	if (res.status !== 'success') {
		throw new Error('명세서 상세 수정 실패');
	}
	return res.data;
};

export const deleteStatementDetail = async (ids: number[]) => {
	const res = await FetchApiDelete('/sales/statement/detail', undefined, ids);
	if (res.status !== 'success') {
		throw new Error('명세서 상세 삭제 실패');
	}
	return res.data;
};

export const searchStatementDetail = async (
	payload: GetSearchStatementDetailListPayload
) => {
	const res = await FetchApiGet('/sales/statement/detail/search', payload);
	if (res.status !== 'success') {
		throw new Error('명세서 상세 검색 실패');
	}
	return res.data;
};

export const getStatementDetailFieldName = async (fieldName: string) => {
	const res = await FetchApiGet(
		`/sales/statement/detail/fields/${fieldName}`
	);
	if (res.status !== 'success') {
		throw new Error('명세서 상세 필드 조회 실패');
	}
	return res.data;
};

export const getStatementDetailListById = async (
	statementMasterId: number,
	page: number = 0,
	size: number = 10
) => {
	const res = await FetchApiGet('/sales/statement/detail', {
		statementMasterId,
		page,
		size,
	});
	if (res.status !== 'success') {
		throw new Error(`명세서 ID ${statementMasterId}의 상세 목록 조회 실패`);
	}
	return res.data;
};
