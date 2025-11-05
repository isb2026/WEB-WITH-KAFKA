import {
	FetchApiPost,
	FetchApiGet,
	FetchApiPut,
	FetchApiDelete,
} from '@primes/utils/request';

// Terminal Master API calls
export const getTerminalList = async (
	searchRequest: any = {},
	page: number = 0,
	size: number = 10
) => {
	const res = await FetchApiGet('/ini/terminal', {
		searchRequest,
		page,
		size,
	});
	if (res.status !== 'success') {
		throw new Error('Terminal 목록 조회 실패');
	}
	return res.data;
};

export const createTerminal = async (data: any) => {
	const res = await FetchApiPost('/ini/terminal', data);
	if (res.status !== 'success') {
		throw new Error('Terminal 생성 실패');
	}
	return res.data;
};

export const updateTerminal = async (id: number, data: any) => {
	const res = await FetchApiPut(`/ini/terminal/${id}`, data);
	if (res.status !== 'success') {
		throw new Error('Terminal 수정 실패');
	}
	return res.data;
};

export const deleteTerminal = async (ids: number[]) => {
	const res = await FetchApiDelete('/ini/terminal', ids);
	if (res.status !== 'success') {
		throw new Error('Terminal 삭제 실패');
	}
	return res.data;
};