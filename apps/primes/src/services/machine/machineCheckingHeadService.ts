import {
	FetchApiPost,
	FetchApiGet,
	FetchApiPut,
	FetchApiDelete,
} from '@primes/utils/request';

// MachineCheckingHead Master API calls
export const getMachineCheckingHeadList = async (
	searchRequest: any = {},
	page: number = 0,
	size: number = 10
) => {
	const res = await FetchApiGet('/machine/machine-checking-head', {
		searchRequest,
		page,
		size,
	});
	if (res.status !== 'success') {
		throw new Error('MachineCheckingHead 목록 조회 실패');
	}
	return res.data;
};

export const createMachineCheckingHead = async (data: any) => {
	const res = await FetchApiPost('/machine/machine-checking-head', data);
	if (res.status !== 'success') {
		throw new Error('MachineCheckingHead 생성 실패');
	}
	return res.data;
};

export const updateMachineCheckingHead = async (id: number, data: any) => {
	const res = await FetchApiPut(`/machine/machine-checking-head/${id}`, data);
	if (res.status !== 'success') {
		throw new Error('MachineCheckingHead 수정 실패');
	}
	return res.data;
};

export const deleteMachineCheckingHead = async (ids: number[]) => {
	const res = await FetchApiDelete('/machine/machine-checking-head', ids);
	if (res.status !== 'success') {
		throw new Error('MachineCheckingHead 삭제 실패');
	}
	return res.data;
};