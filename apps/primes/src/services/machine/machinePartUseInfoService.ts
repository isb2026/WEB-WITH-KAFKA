import {
	FetchApiPost,
	FetchApiGet,
	FetchApiPut,
	FetchApiDelete,
} from '@primes/utils/request';
import type {
	MachinePartUseInfo,
	SearchMachinePartUseInfoRequest,
} from '@primes/types/machine';

// MachinePartUseInfo Master API calls
export const getMachinePartUseInfoList = async (
	searchRequest: any = {},
	page: number = 0,
	size: number = 10
) => {
	const res = await FetchApiGet('/machine/machine-part-use-info', {
		searchRequest,
		page,
		size,
	});
	if (res.status !== 'success') {
		throw new Error('설비 예비부품 사용내역 목록 조회 실패');
	}
	return res.data;
};

export const getMachinePartUseInfoById = async (id: number): Promise<MachinePartUseInfo> => {
	const res = await FetchApiGet(`/machine/machine-part-use-info?id=${id}`);

	if (res.status !== 'success') {
		throw new Error(res.errorMessage || '설비 예비부품 사용내역 상세 조회 실패');
	}

	return res.data;
};

export const createMachinePartUseInfo = async (data: any) => {
	const res = await FetchApiPost('/machine/machine-part-use-info', data);
	if (res.status !== 'success') {
		throw new Error('설비 예비부품 사용내역 생성 실패');
	}
	return res.data;
};

export const updateMachinePartUseInfo = async (id: number, data: any) => {
	const res = await FetchApiPut(`/machine/machine-part-use-info/${id}`, data);
	if (res.status !== 'success') {
		throw new Error('설비 예비부품 사용내역 수정 실패');
	}
	return res.data;
};

export const deleteMachinePartUseInfo = async (ids: number[]) => {
	const res = await FetchApiDelete('/machine/machine-part-use-info', undefined, ids);
	if (res.status !== 'success') {
		throw new Error('설비 예비부품 사용내역 삭제 실패');
	}
	return res.data;
};

export const getMachinePartUseInfoFields = async (fieldName: string) => {
	const res = await FetchApiGet(`/machine/machine-part-use-info/fields/${fieldName}`);
	if (res.status !== 'success') {
		throw new Error(res.errorMessage || '설비 예비부품 사용내역 필드 조회 실패');
	}

	return res.data;
};