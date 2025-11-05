import {
	FetchApiPost,
	FetchApiGet,
	FetchApiPut,
	FetchApiDelete,
} from '@primes/utils/request';
import {
	MachinePartOrder,
	SearchMachinePartOrderRequest,
} from '@primes/types/machine';

// MachinePartOrder Master API calls
export const getMachinePartOrderList = async (
	searchRequest: SearchMachinePartOrderRequest = {},
	page: number = 0,
	size: number = 10
) => {
	const res = await FetchApiGet('/machine/machine-part-order', {
		searchRequest,
		page,
		size,
	});
	if (res.status !== 'success') {
		throw new Error('예비부품 발주 목록 조회 실패');
	}
	return res.data;
};

export const getMachinePartOrderById = async (id: number): Promise<MachinePartOrder> => {
	const res = await FetchApiGet(`/machine/machine-part-order/${id}`);
	if (res.status !== 'success') {
		const errorMessage = res.errorMessage || '예비부품 발주 조회 실패';
		throw new Error(errorMessage);
	}
	return res.data;
};

export const createMachinePartOrder = async (data: any) => {
	const res = await FetchApiPost('/machine/machine-part-order', data);
	if (res.status !== 'success') {
		throw new Error('예비부품 발주 생성 실패');
	}
	return res.data;
};

export const updateMachinePartOrder = async (id: number, data: any) => {
	const res = await FetchApiPut(`/machine/machine-part-order/${id}`, data);
	if (res.status !== 'success') {
		throw new Error('예비부품 발주 수정 실패');
	}
	return res.data;
};

export const deleteMachinePartOrder = async (id: number) => {
	const res = await FetchApiDelete('/machine/machine-part-order', undefined, [id]);
	if (res.status !== 'success') {
		throw new Error('예비부품 발주 삭제 실패');
	}
	return res.data;
};

export const getMachinePartOrderFields = async (fieldName: string) => {
	const res = await FetchApiGet(`/machine/machine-part-order/fields/${fieldName}`);
	if (res.status !== 'success') {
		const errorMessage = res.errorMessage || '예비부품 발주 필드 조회 실패';
		throw new Error(errorMessage);
	}
	return res.data;
};
