import {
	FetchApiPost,
	FetchApiGet,
	FetchApiPut,
	FetchApiDelete,
} from '@primes/utils/request';
import {
	MachinePartOrderIn,
	SearchMachinePartOrderInRequest,
} from '@primes/types/machine';

// MachinePartOrderIn Master API calls
export const getMachinePartOrderInList = async (
	searchRequest: any = {},
	page: number = 0,
	size: number = 10
) => {
	const res = await FetchApiGet('/machine/machine-part-order-in', {
		searchRequest,
		page,
		size,
	});
	if (res.status !== 'success') {
		throw new Error('예비부품 입고 목록 조회 실패');
	}
	return res.data;
};

export const getMachinePartOrderInById = async (id: number): Promise<MachinePartOrderIn> => {
	const res = await FetchApiGet(`/machine/machine-part-order-in/${id}`);
	if (res.status !== 'success') {
		const errorMessage = res.errorMessage || '예비부품 입고 조회 실패';
		throw new Error(errorMessage);
	}
	return res.data;
};

export const createMachinePartOrderIn = async (data: any) => {
	const res = await FetchApiPost('/machine/machine-part-order-in', data);
	if (res.status !== 'success') {
		throw new Error('예비부품 입고 생성 실패');
	}
	return res.data;
};

export const updateMachinePartOrderIn = async (id: number, data: any) => {
	const res = await FetchApiPut(`/machine/machine-part-order-in/${id}`, data);
	if (res.status !== 'success') {
		throw new Error('예비부품 입고 수정 실패');
	}
	return res.data;
};

export const deleteMachinePartOrderIn = async (id: number) => {
	const res = await FetchApiDelete('/machine/machine-part-order-in', undefined, [id]);
	if (res.status !== 'success') {
		throw new Error('예비부품 입고 삭제 실패');
	}
	return res.data;
};

export const getMachinePartOrderInFields = async (fieldName: string) => {
	const res = await FetchApiGet(`/machine/machine-part-order-in/fields/${fieldName}`);
	if (res.status !== 'success') {
		const errorMessage = res.errorMessage || '예비부품 발주 필드 조회 실패';
		throw new Error(errorMessage);
	}
	return res.data;
};