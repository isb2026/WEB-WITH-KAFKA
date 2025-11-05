import {
	FetchApiPost,
	FetchApiGet,
	FetchApiPut,
	FetchApiDelete,
	getSearchParams,
} from '@primes/utils/request';
import type {
	WorkingInLotDto,
	WorkingInLotCreateRequest,
	WorkingInLotUpdateRequest,
	WorkingInLotSearchRequest,
	WorkingInLotUpdateAllRequest,
} from '@primes/types/production';

// WorkingInLot 목록 조회
export const getWorkingInLotList = async (
	searchRequest: WorkingInLotSearchRequest = {},
	page: number = 0,
	size: number = 10
) => {
	const searchParams = getSearchParams(searchRequest);
	const res = await FetchApiGet(
		`/production/working-in-lot?page=${page}&size=${size}&${searchParams}`
	);
	if (res.status !== 'success') {
		throw new Error('WorkingInLot 목록 조회 실패');
	}
	return res.data;
};

// WorkingInLot 목록 조회
export const getWorkingInLotGroupByItem = async (
	searchRequest: WorkingInLotSearchRequest = {},
	page: number = 0,
	size: number = 30
) => {
	const searchParams = getSearchParams(searchRequest);
	const res = await FetchApiGet(
		`/production/working-in-lot/group-by-item?page=${page}&size=${size}&${searchParams}`
	);
	if (res.status !== 'success') {
		throw new Error('WorkingInLot 목록 조회 실패');
	}
	return res.data;
};

// WorkingInLot 생성
export const createWorkingInLot = async (data: WorkingInLotCreateRequest[]) => {
	const res = await FetchApiPost('/production/working-in-lot', data);
	if (res.status !== 'success') {
		throw new Error('WorkingInLot 생성 실패');
	}
	return res.data;
};

// WorkingInLot 수정 (배열 형태)
export const updateWorkingInLot = async (data: WorkingInLotUpdateRequest[]) => {
	const res = await FetchApiPut(`/production/working-in-lot`, data);
	if (res.status !== 'success') {
		throw new Error('WorkingInLot 수정 실패');
	}
	return res.data;
};

// WorkingInLot 일괄 수정
export const updateWorkingInLotAll = async (
	data: WorkingInLotUpdateAllRequest
) => {
	const res = await FetchApiPut('/production/working-in-lot', data);
	if (res.status !== 'success') {
		throw new Error('WorkingInLot 일괄 수정 실패');
	}
	return res.data;
};

// WorkingInLot 삭제
export const deleteWorkingInLot = async (ids: number[]) => {
	const res = await FetchApiDelete(
		'/production/working-in-lot',
		undefined,
		ids
	);
	if (res.status !== 'success') {
		throw new Error('WorkingInLot 삭제 실패');
	}
	return res.data;
};

// WorkingInLot 특정 필드 값 조회
export const getWorkingInLotFieldValues = async (
	fieldName: string,
	searchRequest: WorkingInLotSearchRequest = {}
) => {
	const searchParams = getSearchParams(searchRequest);
	const res = await FetchApiGet(
		`/production/working-in-lot/fields/${fieldName}?${searchParams}`
	);
	if (res.status !== 'success') {
		throw new Error('WorkingInLot 필드 값 조회 실패');
	}
	return res.data;
};
