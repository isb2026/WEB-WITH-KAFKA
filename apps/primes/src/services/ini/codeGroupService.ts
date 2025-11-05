import {
	FetchApiPost,
	FetchApiGet,
	FetchApiPut,
	FetchApiDelete,
} from '@primes/utils/request';

// CodeGroup Master API calls
export const getCodeGroupList = async (
	searchRequest: any = {},
	page: number = 0,
	size: number = 10
) => {
	const res = await FetchApiGet('/ini/code-group', {
		searchRequest,
		page,
		size,
	});
	if (res.status !== 'success') {
		throw new Error('CodeGroup 목록 조회 실패');
	}
	return res.data;
};

export const createCodeGroup = async (data: any) => {
	const res = await FetchApiPost('/ini/code-group', data);
	if (res.status !== 'success') {
		throw new Error('CodeGroup 생성 실패');
	}
	return res.data;
};

export const updateCodeGroup = async (id: number, data: any) => {
	const res = await FetchApiPut(`/ini/code-group/${id}`, data);
	if (res.status !== 'success') {
		throw new Error('CodeGroup 수정 실패');
	}
	return res.data;
};

export const deleteCodeGroup = async (ids: number[]) => {
	const res = await FetchApiDelete('/ini/code-group', ids);
	if (res.status !== 'success') {
		throw new Error('CodeGroup 삭제 실패');
	}
	return res.data;
};