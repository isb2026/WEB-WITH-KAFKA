import {
	FetchApiPost,
	FetchApiGet,
	FetchApiPut,
	FetchApiDelete,
} from '@primes/utils/request';
import type { 
	MachinePartRelation,
	SearchMachinePartRelationRequest,
} from '@primes/types/machine';

export const getMachinePartRelationList = async (
	searchRequest: SearchMachinePartRelationRequest = {},
	page: number = 0,
	size: number = 10
) => {
	const res = await FetchApiGet('/machine/machine-part-relation', {
		searchRequest,
		page,
		size,
	});
	if (res.status !== 'success') {
		const errorMessage = res.errorMessage || '설비 예비부품 연동 목록 조회 실패';
		throw new Error(errorMessage);
	}
	return res.data;
};

export const getMachinePartRelationById = async (id: number): Promise<MachinePartRelation> => {
	const res = await FetchApiGet(`/machine/machine-part-relation?id=${id}`);
	if (res.status !== 'success') {
		const errorMessage = res.errorMessage || '설비 예비부품 연동 조회 실패';
		throw new Error(errorMessage);
	}
	return res.data;
};

export const createMachinePartRelation = async (data: any) => {
	const res = await FetchApiPost('/machine/machine-part-relation', data);
	if (res.status !== 'success') {
		throw new Error('설비 예비부품 연동 생성 실패');
	}
	return res.data;
};

export const updateMachinePartRelation = async (id: number, data: any) => {
	const res = await FetchApiPut(`/machine/machine-part-relation/${id}`, data);
	if (res.status !== 'success') {
		throw new Error('설비 예비부품 연동 수정 실패');
	}
	return res.data;
};

export const deleteMachinePartRelation = async (ids: number[]) => {
	const res = await FetchApiDelete(`/machine/machine-part-relation`, undefined, ids);
	if (res.status !== 'success') {
		throw new Error('설비 예비부품 연동 삭제 실패');
	}
	return res.data;
};

export const getMachinePartRelationFields = async (fieldName: string) => {
	const res = await FetchApiGet(`/machine/machine-part-relation/fields/${fieldName}`);
	if (res.status !== 'success') {
		const errorMessage = res.errorMessage || 'MachinePartRelation 필드 조회 실패';
		throw new Error(errorMessage);
	}
	return res.data;
};
