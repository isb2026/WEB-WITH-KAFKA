import {
	FetchApiPost,
	FetchApiGet,
	FetchApiPut,
	FetchApiDelete,
} from '@primes/utils/request';

// MachineCheckingData Master API calls
export const getMachineCheckingDataList = async (
	searchRequest: any = {},
	page: number = 0,
	size: number = 10
) => {
	const res = await FetchApiGet('/machine/machine-checking-data', {
		searchRequest,
		page,
		size,
	});
	if (res.status !== 'success') {
		throw new Error('MachineCheckingData 목록 조회 실패');
	}
	return res.data;
};

export const createMachineCheckingData = async (data: any) => {
	const res = await FetchApiPost('/machine/machine-checking-data', data);
	if (res.status !== 'success') {
		throw new Error('MachineCheckingData 생성 실패');
	}
	return res.data;
};

export const updateMachineCheckingData = async (id: number, data: any) => {
	const res = await FetchApiPut(`/machine/machine-checking-data/${id}`, data);
	if (res.status !== 'success') {
		throw new Error('MachineCheckingData 수정 실패');
	}
	return res.data;
};

export const deleteMachineCheckingData = async (ids: number[]) => {
	const res = await FetchApiDelete('/machine/machine-checking-data', ids);
	if (res.status !== 'success') {
		throw new Error('MachineCheckingData 삭제 실패');
	}
	return res.data;
};