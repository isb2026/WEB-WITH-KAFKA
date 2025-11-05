import {
	FetchApiPost,
	FetchApiGet,
	FetchApiPut,
	FetchApiDelete,
} from '@primes/utils/request';

// WorkingBuffer Master API calls
export const getWorkingBufferList = async (
	searchRequest: any = {},
	page: number = 0,
	size: number = 10
) => {
	const res = await FetchApiGet('/production/working-buffer', {
		searchRequest,
		page,
		size,
	});
	if (res.status !== 'success') {
		throw new Error('WorkingBuffer 목록 조회 실패');
	}
	return res.data;
};

export const createWorkingBuffer = async (data: any) => {
	const res = await FetchApiPost('/production/working-buffer', data);
	if (res.status !== 'success') {
		throw new Error('WorkingBuffer 생성 실패');
	}
	return res.data;
};

export const updateWorkingBuffer = async (id: number, data: any) => {
	const res = await FetchApiPut(`/production/working-buffer/${id}`, data);
	if (res.status !== 'success') {
		throw new Error('WorkingBuffer 수정 실패');
	}
	return res.data;
};

export const deleteWorkingBuffer = async (ids: number[]) => {
	const res = await FetchApiDelete('/production/working-buffer', ids);
	if (res.status !== 'success') {
		throw new Error('WorkingBuffer 삭제 실패');
	}
	return res.data;
};