import {
	FetchApiPost,
	FetchApiGet,
	FetchApiPut,
	FetchApiDelete,
} from '@primes/utils/request';

// ProgressRoute Master API calls
export const getProgressRouteList = async (
	searchRequest: any = {},
	page: number = 0,
	size: number = 10
) => {
	const res = await FetchApiGet('/ini/progress-route', {
		searchRequest,
		page,
		size,
	});
	if (res.status !== 'success') {
		throw new Error('ProgressRoute 목록 조회 실패');
	}
	return res.data;
};

export const createProgressRoute = async (data: any) => {
	const res = await FetchApiPost('/ini/progress-route', data);
	if (res.status !== 'success') {
		throw new Error('ProgressRoute 생성 실패');
	}
	return res.data;
};

export const updateProgressRoute = async (id: number, data: any) => {
	const res = await FetchApiPut(`/ini/progress-route/${id}`, data);
	if (res.status !== 'success') {
		throw new Error('ProgressRoute 수정 실패');
	}
	return res.data;
};

export const deleteProgressRoute = async (ids: number[]) => {
	const res = await FetchApiDelete('/ini/progress-route', ids);
	if (res.status !== 'success') {
		throw new Error('ProgressRoute 삭제 실패');
	}
	return res.data;
};