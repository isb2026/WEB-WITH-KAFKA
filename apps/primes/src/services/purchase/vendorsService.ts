import {
	FetchApiPost,
	FetchApiGet,
	FetchApiPut,
	FetchApiDelete,
} from '@primes/utils/request';
import { GetAllVendorsListPayload } from '@primes/types/purchase/vendors';
import { GetSearchVendorsListPayload } from '@primes/types/purchase/vendors';
import {
	CreateVendorsPayload,
	UpdateVendorsPayload,
} from '@primes/types/purchase/vendors';

export const getAllVendorsList = async (payload: GetAllVendorsListPayload) => {
	const res = await FetchApiGet('/purchase/vendors', payload);
	if (res.status !== 'success') {
		throw new Error('목록 조회 실패');
	}
	return res.data;
};

export const createVendors = async (data: Partial<CreateVendorsPayload>) => {
	const res = await FetchApiPost('/purchase/vendors', data);
	if (res.status !== 'success') {
		throw new Error('생성 실패');
	}
	return res.data;
};

export const updateVendors = async (
	id: number,
	data: Partial<UpdateVendorsPayload>
) => {
	const res = await FetchApiPut(`/purchase/vendors/${id}`, data);
	if (res.status !== 'success') {
		throw new Error('수정 실패');
	}
	return res.data;
};

export const deleteVendors = async (id: number) => {
	const res = await FetchApiDelete(`/purchase/vendors/${id}`);
	if (res.status !== 'success') {
		throw new Error('삭제 실패');
	}
	return res.data;
};

export const searchVendors = async (payload: GetSearchVendorsListPayload) => {
	const res = await FetchApiGet('/purchase/vendors/search', payload);
	if (res.status !== 'success') {
		throw new Error('검색 실패');
	}
	return res.data;
};

export const getVendorsFieldName = async (fieldName: string) => {
	const res = await FetchApiGet(`/purchase/vendors/fields/${fieldName}`);
	if (res.status !== 'success') {
		throw new Error('필드 조회 실패');
	}
	return res.data;
};
