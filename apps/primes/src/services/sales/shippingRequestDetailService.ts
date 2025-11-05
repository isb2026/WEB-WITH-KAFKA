import {
	FetchApiPost,
	FetchApiGet,
	FetchApiPut,
	FetchApiDelete,
} from '@primes/utils/request';
// import { GetAllShippingRequestDetailListPayload } from '@primes/types/sales/shippingRequestDetail';
import { GetSearchShippingRequestDetailListPayload } from '@primes/types/sales/shippingRequestDetail';
import {
	CreateShippingRequestDetailPayload,
	CreateShippingRequestDetailPayloadArray,
	UpdateShippingRequestDetailPayload,
} from '@primes/types/sales/shippingRequestDetail';

export const getAllShippingRequestDetailList = async () => {
	const res = await FetchApiGet('/sales/shipping-request/detail');
	if (res.status !== 'success') {
		throw new Error('출하 요청 상세 목록 조회 실패');
	}
	return res.data;
};

export const createShippingRequestDetail = async (
	data: CreateShippingRequestDetailPayloadArray
) => {
	const res = await FetchApiPost('/sales/shipping-request/detail', data);
	if (res.status !== 'success') {
		throw new Error('출하 요청 상세 생성 실패');
	}
	return res.data;
};

export const updateShippingRequestDetail = async (
	id: number,
	data: UpdateShippingRequestDetailPayload[]
) => {
	const res = await FetchApiPut(`/sales/shipping-request/detail`, data);
	if (res.status !== 'success') {
		throw new Error('출하 요청 상세 수정 실패');
	}
	return res.data;
};

export const deleteShippingRequestDetail = async (ids: number[]) => {
	const res = await FetchApiDelete(
		`/sales/shipping-request/detail`,
		undefined,
		ids
	);
	if (res.status !== 'success') {
		throw new Error('출하 요청 상세 삭제 실패');
	}
	return res.data;
};

export const searchShippingRequestDetail = async (
	payload: GetSearchShippingRequestDetailListPayload
) => {
	const res = await FetchApiGet(
		'/sales/shipping-request/detail/search',
		payload
	);
	if (res.status !== 'success') {
		throw new Error('출하 요청 상세 검색 실패');
	}
	return res.data;
};

export const getShippingRequestDetailFieldName = async (fieldName: string) => {
	const res = await FetchApiGet(
		`/sales/shipping-request/detail/fields/${fieldName}`
	);
	if (res.status !== 'success') {
		throw new Error('출하 요청 상세 필드 조회 실패');
	}
	return res.data;
};

export const getShippingRequestDetailByMasterId = async (
	masterId: number,
	page: number = 0,
	size: number = 10
) => {
	const res = await FetchApiGet('/sales/shipping-request/detail', {
		shippingRequestMasterId: masterId,
		page,
		size,
	});
	if (res.status !== 'success') {
		throw new Error(
			`Shipping Request ID ${masterId}의 상세 목록 조회 실패`
		);
	}
	return res.data;
};
