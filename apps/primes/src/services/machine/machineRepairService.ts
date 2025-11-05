import {
	FetchApiGet,
	FetchApiPost,
	FetchApiPut,
	FetchApiDelete,
} from '@primes/utils/request';
import type {
	MachineRepair,
	SearchMachineRepairRequest,
} from '@primes/types/machine';

// 설비 수리 목록 조회
export const getMachineRepairList = async (
	searchRequest: SearchMachineRepairRequest = {},
	page: number = 0,
	size: number = 10
) => {
	const res = await FetchApiGet('/machine/machine-repair', {
		searchRequest,
		page,
		size,
	});

	if (res.status !== 'success') {
		throw new Error(res.errorMessage || '설비 수리 목록 조회 실패');
	}

	return res.data;
};

// 설비 수리 상세 조회
export const getMachineRepairById = async (id: number): Promise<MachineRepair> => {
	const res = await FetchApiGet(`/machine/machine-repair?id=${id}`);

	if (res.status !== 'success') {
		throw new Error(res.errorMessage || '설비 수리 상세 조회 실패');
	}

	return res.data;
};

// 설비 수리 등록

export const createMachineRepair = async (data: any) => {
	const res = await FetchApiPost('/machine/machine-repair', data);
	if (res.status !== 'success') {
		throw new Error('설비 수리 생성 실패');
	}
	return res.data;
};

// 설비 수리 수정
export const updateMachineRepair = async (id: number, data: any) => {
	const res = await FetchApiPut(`/machine/machine-repair/${id}`, data);
	if (res.status !== 'success') {
		throw new Error('설비 수리 수정 실패');
	}
	return res.data;
};

// 설비 수리 삭제
export const deleteMachineRepair = async (ids: number[]) => {
	const res = await FetchApiDelete(`/machine/machine-repair`, undefined, ids);

	if (res.status !== 'success') {
		throw new Error(res.errorMessage || '설비 수리 삭제 실패');
	}
};

// Field API - 설비 수리 필드 조회 (Custom Select용)
export const getMachineRepairFields = async (fieldName: string) => {
	const res = await FetchApiGet(`/machine/machine-repair/fields/${fieldName}`);
	if (res.status !== 'success') {
		throw new Error(res.errorMessage || '설비 수리 필드 조회 실패');
	}

	return res.data;
};
