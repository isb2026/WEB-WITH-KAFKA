import {
	FetchApiPost,
	FetchApiGet,
	FetchApiPut,
	FetchApiDelete,
} from '@primes/utils/request';
import {
	GetAllEstimateMasterListPayload,
	GetAllEstimateMasterListWithDetailPayload,
} from '@primes/types/sales/estimateMaster';
import { GetSearchEstimateMasterListPayload } from '@primes/types/sales/estimateMaster';
import {
	CreateEstimateMasterPayload,
	UpdateEstimateMasterPayload,
} from '@primes/types/sales/estimateMaster';

export const getAllEstimateMasterList = async (
	payload: GetAllEstimateMasterListPayload
) => {
	const res = await FetchApiGet('/sales/estimate/master', payload);
	if (res.status !== 'success') {
		throw new Error('견적 마스터 목록 조회 실패');
	}
	return res.data;
};

export const getAllEstimateMasterListWithDetail = async (
	payload: GetAllEstimateMasterListWithDetailPayload
) => {
	const res = await FetchApiGet(
		'/sales/estimate/master/with-details',
		payload
	);
	if (res.status !== 'success') {
		throw new Error('견적 목록 조회 실패');
	}
	return res.data;
};

export const createEstimateMaster = async (
	data: Partial<CreateEstimateMasterPayload>
) => {
	const res = await FetchApiPost('/sales/estimate/master', data);
	if (res.status !== 'success') {
		throw new Error('견적 마스터 생성 실패');
	}
	return res.data;
};

export const updateEstimateMaster = async (
	id: number,
	data: Partial<UpdateEstimateMasterPayload>
) => {
	const res = await FetchApiPut(`/sales/estimate/master/${id}`, data);
	if (res.status !== 'success') {
		throw new Error('견적 마스터 수정 실패');
	}
	return res.data;
};

export const deleteEstimateMaster = async (ids: number[]) => {
	const res = await FetchApiDelete(`/sales/estimate/master`, undefined, ids);
	if (res.status !== 'success') {
		throw new Error('견적 마스터 삭제 실패');
	}
	return res.data;
};

export const searchEstimateMaster = async (
	payload: GetSearchEstimateMasterListPayload
) => {
	const res = await FetchApiGet('/sales/estimate/master/search', payload);
	if (res.status !== 'success') {
		throw new Error('견적 마스터 검색 실패');
	}
	return res.data;
};

export const getEstimateMasterFieldName = async (fieldName: string) => {
	const res = await FetchApiGet(`/sales/estimate/master/fields/${fieldName}`);
	if (res.status !== 'success') {
		throw new Error('견적 마스터 필드 조회 실패');
	}
	return res.data;
};

export const getEstimateMasterById = async (params: {
	id: number;
	page: number;
	size: number;
}) => {
	const res = await FetchApiGet('/sales/estimate/master', params);
	if (res.status !== 'success') {
		throw new Error('견적 마스터 조회 실패');
	}
	return res.data;
};
