import {
	FetchApiPost,
	FetchApiGet,
	FetchApiPut,
	FetchApiDelete,
} from '@primes/utils/request';
import {
	GetAllStatementMasterListPayload,
	GetAllStatementMasterListWithDetailPayload,
} from '@primes/types/sales/statementMaster';
import { GetSearchStatementMasterListPayload } from '@primes/types/sales/statementMaster';
import {
	CreateStatementMasterPayload,
	UpdateStatementMasterPayload,
} from '@primes/types/sales/statementMaster';

export const getAllStatementMasterList = async (
	payload: GetAllStatementMasterListPayload
) => {
	const res = await FetchApiGet('/sales/statement/master', payload);
	if (res.status !== 'success') {
		throw new Error('명세서 마스터 목록 조회 실패');
	}
	return res.data;
};

export const getAllStatementMasterListWithDetail = async (
	payload: GetAllStatementMasterListWithDetailPayload
) => {
	const res = await FetchApiGet(
		'/sales/statement/master/with-details',
		payload
	);
	if (res.status !== 'success') {
		throw new Error('명세서 목록 조회 실패');
	}
	return res.data;
};

export const createStatementMaster = async (
	data: Partial<CreateStatementMasterPayload>
) => {
	const res = await FetchApiPost('/sales/statement/master', data);
	if (res.status !== 'success') {
		throw new Error('명세서 마스터 생성 실패');
	}
	return res.data;
};

export const updateStatementMaster = async (
	id: number,
	data: Partial<UpdateStatementMasterPayload>
) => {
	const res = await FetchApiPut(`/sales/statement/master/${id}`, data);
	if (res.status !== 'success') {
		throw new Error('명세서 마스터 수정 실패');
	}
	return res.data;
};

export const deleteStatementMaster = async (ids: number[]) => {
	const res = await FetchApiDelete(`/sales/statement/master`, undefined, ids);
	if (res.status !== 'success') {
		throw new Error('명세서 마스터 삭제 실패');
	}
	return res.data;
};

export const searchStatementMaster = async (
	payload: GetSearchStatementMasterListPayload
) => {
	const res = await FetchApiGet('/sales/statement/master/search', payload);
	if (res.status !== 'success') {
		throw new Error('명세서 마스터 검색 실패');
	}
	return res.data;
};

export const getStatementMasterFieldName = async (fieldName: string) => {
	const res = await FetchApiGet(
		`/sales/statement/master/fields/${fieldName}`
	);
	if (res.status !== 'success') {
		throw new Error('명세서 마스터 필드 조회 실패');
	}
	return res.data;
};

export const getStatementMasterById = async (params: {
	id: number;
	page: number;
	size: number;
}) => {
	const res = await FetchApiGet('/sales/statement/master', params);
	if (res.status !== 'success') {
		throw new Error('명세서 마스터 조회 실패');
	}
	return res.data;
};
