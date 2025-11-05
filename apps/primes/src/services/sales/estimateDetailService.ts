import {
	FetchApiPost,
	FetchApiGet,
	FetchApiPut,
	FetchApiDelete,
} from '@primes/utils/request';
import { GetAllEstimateDetailListPayload } from '@primes/types/sales/estimateDetail';
import { GetSearchEstimateDetailListPayload } from '@primes/types/sales/estimateDetail';
import {
	CreateEstimateDetailPayload,
	UpdateEstimateDetailPayload,
} from '@primes/types/sales/estimateDetail';

export const getAllEstimateDetailList = async (
	payload: GetAllEstimateDetailListPayload
) => {
	const res = await FetchApiGet('/sales/estimate/detail', payload);
	if (res.status !== 'success') {
		throw new Error('견적 상세 목록 조회 실패');
	}
	return res.data;
};

export const createEstimateDetail = async (
	data: any[]
) => {
	const res = await FetchApiPost('/sales/estimate/detail', data);
	if (res.status !== 'success') {
		throw new Error('견적 상세 생성 실패');
	}
	return res.data;
};

export const updateEstimateDetail = async (
	id: number,
	data: Partial<UpdateEstimateDetailPayload>
) => {
	const res = await FetchApiPut(`/sales/estimate/detail/${id}`, data);
	if (res.status !== 'success') {
		throw new Error('견적 상세 수정 실패');
	}
	return res.data;
};

export const deleteEstimateDetail = async (ids: number[]) => {
	const res = await FetchApiDelete(`/sales/estimate/detail`, undefined, ids);
	if (res.status !== 'success') {
		throw new Error('견적 상세 삭제 실패');
	}
	return res.data;
};

export const searchEstimateDetail = async (
	payload: GetSearchEstimateDetailListPayload
) => {
	const res = await FetchApiGet('/sales/estimate/detail/search', payload);
	if (res.status !== 'success') {
		throw new Error('견적 상세 검색 실패');
	}
	return res.data;
};

export const getEstimateDetailFieldName = async (fieldName: string) => {
	const res = await FetchApiGet(`/sales/estimate/detail/fields/${fieldName}`);
	if (res.status !== 'success') {
		throw new Error('견적 상세 필드 조회 실패');
	}
	return res.data;
};

export const getEstimateDetailListById = async (
	estimateMasterId: number,
	page: number = 0,
	size: number = 10
) => {
	const res = await FetchApiGet('/sales/estimate/detail', {
		estimateMasterId,
		page,
		size,
	});
	if (res.status !== 'success') {
		throw new Error(`견적 ID ${estimateMasterId}의 상세 목록 조회 실패`);
	}
	return res.data;
};
