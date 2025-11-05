/**
 * Working User Service - SinglePage 패턴
 * API: /working-user
 */

import {
	FetchApiPost,
	FetchApiGet,
	FetchApiPut,
	FetchApiDelete,
	getSearchParams,
} from '@primes/utils/request';
import {
	WorkingUser,
	CreateWorkingUserPayload,
	UpdateWorkingUserPayload,
	WorkingUserSearchParams,
	WorkingUserListResponse,
} from '@primes/types/production';

export const getWorkingUserList = async (
	searchRequest: WorkingUserSearchParams = {},
	page: number = 0,
	size: number = 10
): Promise<WorkingUserListResponse> => {
	const { workingMasterId, userNo, workerName } = searchRequest;
	const cleanedSearchRequest = { workingMasterId, userNo, workerName };
	const searchParams = getSearchParams(cleanedSearchRequest || {});
	const url = `/working-user?page=${page}&size=${size}&${searchParams}`;

	const res = await FetchApiGet(url);
	if (res.status !== 'success') {
		const errorMessage = res.errorMessage || '작업자 목록 조회 실패';
		throw new Error(errorMessage);
	}
	return res.data;
};

export const getWorkingUserById = async (id: number): Promise<WorkingUser> => {
	const res = await FetchApiGet(`/working-user/${id}`);
	if (res.status !== 'success') {
		const errorMessage = res.errorMessage || '작업자 조회 실패';
		throw new Error(errorMessage);
	}
	return res.data;
};

export const createWorkingUser = async (
	data: Partial<CreateWorkingUserPayload>
) => {
	const { workingMasterId, userNo, workerName, gongsu } = data;
	const cleanedParams = { workingMasterId, userNo, workerName, gongsu };

	const res = await FetchApiPost('/working-user', cleanedParams);
	if (res.status !== 'success') {
		const errorMessage = res.errorMessage || '작업자 등록 실패';
		throw new Error(errorMessage);
	}
	return res.data;
};

export const updateWorkingUser = async (
	id: number,
	data: Partial<UpdateWorkingUserPayload>
) => {
	const { workingMasterId, userNo, workerName, gongsu } = data;
	const cleanedParams = { workingMasterId, userNo, workerName, gongsu };

	const res = await FetchApiPut(`/working-user/${id}`, cleanedParams);
	if (res.status !== 'success') {
		const errorMessage = res.errorMessage || '작업자 수정 실패';
		throw new Error(errorMessage);
	}
	return res.data;
};

export const deleteWorkingUser = async (ids: number[]) => {
	const res = await FetchApiDelete('/working-user', { dataList: ids });
	if (res.status !== 'success') {
		const errorMessage = res.errorMessage || '작업자 삭제 실패';
		throw new Error(errorMessage);
	}
	return res.data;
};

// Field API
export const getWorkingUserFields = async (fieldName: string) => {
	const res = await FetchApiGet(`/working-user/fields/${fieldName}`);
	if (res.status !== 'success') {
		const errorMessage = res.errorMessage || '작업자 필드 조회 실패';
		throw new Error(errorMessage);
	}
	return res.data;
};
