import {
	FetchApiPost,
	FetchApiGet,
	FetchApiPut,
	FetchApiDelete,
} from '@primes/utils/request';

// Statement Master API calls
export const getStatementList = async (
	searchRequest: any = {},
	page: number = 0,
	size: number = 10
) => {
	const res = await FetchApiGet('/sales/statement', {
		searchRequest,
		page,
		size,
	});
	if (res.status !== 'success') {
		throw new Error('Statement 목록 조회 실패');
	}
	return res.data;
};

export const createStatement = async (data: any) => {
	const res = await FetchApiPost('/sales/statement', data);
	if (res.status !== 'success') {
		throw new Error('Statement 생성 실패');
	}
	return res.data;
};

export const updateStatement = async (id: number, data: any) => {
	const res = await FetchApiPut(`/sales/statement/${id}`, data);
	if (res.status !== 'success') {
		throw new Error('Statement 수정 실패');
	}
	return res.data;
};

export const deleteStatement = async (ids: number[]) => {
	const res = await FetchApiDelete('/sales/statement', ids);
	if (res.status !== 'success') {
		throw new Error('Statement 삭제 실패');
	}
	return res.data;
};

// Statement Detail API calls
export const getStatementDetailList = async (
	searchRequest: any = {},
	page: number = 0,
	size: number = 10
) => {
	const res = await FetchApiGet('/sales/statement/detail', {
		searchRequest,
		page,
		size,
	});
	if (res.status !== 'success') {
		throw new Error('Statement 상세 목록 조회 실패');
	}
	return res.data;
};

export const getStatementDetailByMasterId = async (
	masterId: number,
	page: number = 0,
	size: number = 10
) => {
	const res = await FetchApiGet('/sales/statement/detail', {
		searchRequest: { masterId },
		page,
		size,
	});
	if (res.status !== 'success') {
		throw new Error(`Statement ID ${masterId}의 상세 목록 조회 실패`);
	}
	return res.data;
};

export const createStatementDetail = async (data: any) => {
	const res = await FetchApiPost('/sales/statement/detail', data);
	if (res.status !== 'success') {
		throw new Error('Statement 상세 생성 실패');
	}
	return res.data;
};

export const updateStatementDetail = async (id: number, data: any) => {
	const res = await FetchApiPut(`/sales/statement/detail/${id}`, data);
	if (res.status !== 'success') {
		throw new Error('Statement 상세 수정 실패');
	}
	return res.data;
};

export const deleteStatementDetail = async (ids: number[]) => {
	const res = await FetchApiDelete('/sales/statement/detail', ids);
	if (res.status !== 'success') {
		throw new Error('Statement 상세 삭제 실패');
	}
	return res.data;
};