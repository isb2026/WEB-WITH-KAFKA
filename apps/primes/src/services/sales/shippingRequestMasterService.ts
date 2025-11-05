import {
	FetchApiPost,
	FetchApiGet,
	FetchApiPut,
	FetchApiDelete,
} from '@primes/utils/request';
import {
	GetAllShippingRequestMasterListPayload,
	GetAllShippingRequestMasterListWithDetailPayload,
} from '@primes/types/sales/shippingRequestMaster';
import { GetSearchShippingRequestMasterListPayload } from '@primes/types/sales/shippingRequestMaster';
import {
	CreateShippingRequestMasterPayload,
	UpdateShippingRequestMasterPayload,
} from '@primes/types/sales/shippingRequestMaster';

export const getAllShippingRequestMasterList = async (
	payload: GetAllShippingRequestMasterListPayload
) => {
	const res = await FetchApiGet('/sales/shipping-request/master', payload);
	if (res.status !== 'success') {
		throw new Error('출하 요청 마스터 목록 조회 실패');
	}
	return res.data;
};

export const getAllShippingRequestMasterListWithDetail = async (
	payload: GetAllShippingRequestMasterListWithDetailPayload
) => {
	const res = await FetchApiGet(
		'/sales/shipping-request/master/with-details',
		payload
	);
	if (res.status !== 'success') {
		throw new Error('출하 요청 목록 조회 실패');
	}
	return res.data;
};

export const createShippingRequestMaster = async (
	data: Partial<CreateShippingRequestMasterPayload>
) => {
	const res = await FetchApiPost('/sales/shipping-request/master', data);
	if (res.status !== 'success') {
		throw new Error('출하 요청 마스터 생성 실패');
	}
	return res.data;
};

export const updateShippingRequestMaster = async (
	id: number,
	data: Partial<UpdateShippingRequestMasterPayload>
) => {
	const res = await FetchApiPut(`/sales/shipping-request/master/${id}`, data);
	if (res.status !== 'success') {
		throw new Error('출하 요청 마스터 수정 실패');
	}
	return res.data;
};

export const deleteShippingRequestMaster = async (ids: number[]) => {
	const res = await FetchApiDelete(
		`/sales/shipping-request/master`,
		undefined,
		ids
	);
	if (res.status !== 'success') {
		throw new Error('출하 요청 마스터 삭제 실패');
	}
	return res.data;
};

export const searchShippingRequestMaster = async (
	payload: GetSearchShippingRequestMasterListPayload
) => {
	const res = await FetchApiGet(
		'/sales/shipping-request/master/search',
		payload
	);
	if (res.status !== 'success') {
		throw new Error('출하 요청 마스터 검색 실패');
	}
	return res.data;
};

export const getShippingRequestMasterFieldName = async (fieldName: string) => {
	const res = await FetchApiGet(
		`/sales/shipping-request/master/fields/${fieldName}`
	);
	if (res.status !== 'success') {
		throw new Error('출하 요청 마스터 필드 조회 실패');
	}
	return res.data;
};

export const getShippingRequestMasterById = async ({
	id,
	page = 0,
	size = 10,
}: {
	id: number;
	page?: number;
	size?: number;
}) => {
	const res = await FetchApiGet(`/sales/shipping-request/master`, {
		id,
		page,
		size,
	});
	if (res.status !== 'success') {
		throw new Error('출하 요청 마스터 조회 실패');
	}
	return res.data;
};
