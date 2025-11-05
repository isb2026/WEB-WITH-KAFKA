import {
	FetchApiPost,
	FetchApiGet,
	FetchApiPut,
	FetchApiDelete,
} from '@primes/utils/request';

// WorkingTransaction Master API calls
export const getWorkingTransactionList = async (
	searchRequest: any = {},
	page: number = 0,
	size: number = 10
) => {
	const res = await FetchApiGet('/production/working-transaction', {
		searchRequest,
		page,
		size,
	});
	if (res.status !== 'success') {
		throw new Error('WorkingTransaction 목록 조회 실패');
	}
	return res.data;
};

export const createWorkingTransaction = async (data: any) => {
	const res = await FetchApiPost('/production/working-transaction', data);
	if (res.status !== 'success') {
		throw new Error('WorkingTransaction 생성 실패');
	}
	return res.data;
};

export const updateWorkingTransaction = async (id: number, data: any) => {
	const res = await FetchApiPut(`/production/working-transaction/${id}`, data);
	if (res.status !== 'success') {
		throw new Error('WorkingTransaction 수정 실패');
	}
	return res.data;
};

export const deleteWorkingTransaction = async (ids: number[]) => {
	const res = await FetchApiDelete('/production/working-transaction', ids);
	if (res.status !== 'success') {
		throw new Error('WorkingTransaction 삭제 실패');
	}
	return res.data;
};