import {
	FetchApiPost,
	FetchApiGet,
	FetchApiPut,
	FetchApiDelete,
} from '@primes/utils/request';
import {
	MachinePart,
	SearchMachinePartRequest,
} from '@primes/types/machine';

// MachinePart Master API calls
export const getMachinePartList = async (
	searchRequest: SearchMachinePartRequest = {},
	page: number = 0,
	size: number = 10
) => {
	const res = await FetchApiGet('/machine/machine-part', {
		searchRequest,
		page,
		size,
	});
	if (res.status !== 'success') {
		const errorMessage = res.errorMessage || '설비 예비부품 목록 조회 실패';
		throw new Error(errorMessage);
	}
	return res.data;
};

export const getMachinePartById = async (id: number): Promise<MachinePart> => {
	const res = await FetchApiGet(`/machine/machine-part?id=${id}`);
	if (res.status !== 'success') {
		const errorMessage = res.errorMessage || '설비 예비부품 조회 실패';
		throw new Error(errorMessage);
	}
	return res.data;
};

export const createMachinePart = async (data: any) => {
	const res = await FetchApiPost('/machine/machine-part', data);
	if (res.status !== 'success') {
		throw new Error('설비 예비부품 생성 실패');
	}
	return res.data;
};

export const updateMachinePart = async (id: number, data: any) => {
	const res = await FetchApiPut(`/machine/machine-part/${id}`, data);
	if (res.status !== 'success') {
		throw new Error('설비 예비부품 수정 실패');
	}
	return res.data;
};

export const deleteMachinePart = async (ids: number[]) => {
	const res = await FetchApiDelete(`/machine/machine-part`, undefined, ids);
	if (res.status !== 'success') {
		throw new Error('설비 예비부품 삭제 실패');
	}
	return res.data;
};

// Field API for Machine Part
export const getMachinePartFields = async (fieldName: string) => {
	const res = await FetchApiGet(`/machine/machine-part/fields/${fieldName}`);
	if (res.status !== 'success') {
		const errorMessage = res.errorMessage || 'MachinePart 필드 조회 실패';
		throw new Error(errorMessage);
	}
	return res.data;
};
