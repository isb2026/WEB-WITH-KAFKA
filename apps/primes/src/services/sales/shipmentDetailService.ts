import {
	FetchApiPost,
	FetchApiGet,
	FetchApiPut,
	FetchApiDelete,
} from '@primes/utils/request';
import { GetAllShipmentDetailListPayload } from '@primes/types/sales/shipmentDetail';
import { GetSearchShipmentDetailListPayload } from '@primes/types/sales/shipmentDetail';
// import {
// 	CreateShipmentDetailPayload,
// 	UpdateShipmentDetailPayload,
// } from '@primes/types/sales/shipmentDetail';

export const getAllShipmentDetailList = async (
	payload: GetAllShipmentDetailListPayload
) => {
	const res = await FetchApiGet('/sales/shipment/detail', payload);
	if (res.status !== 'success') {
		throw new Error('납품 상세 목록 조회 실패');
	}
	return res.data;
};

export const createShipmentDetail = async (data: any) => {
	const res = await FetchApiPost('/sales/shipment/detail', data);
	if (res.status !== 'success') {
		throw new Error('납품 상세 생성 실패');
	}
	return res.data;
};

export const updateShipmentDetail = async (data: any) => {
	const res = await FetchApiPut(`/sales/shipment/detail`, data);
	if (res.status !== 'success') {
		throw new Error('납품 상세 수정 실패');
	}
	return res.data;
};

export const deleteShipmentDetail = async (ids: number[]) => {
	const res = await FetchApiDelete(`/sales/shipment/detail`, undefined, ids);
	if (res.status !== 'success') {
		throw new Error('출하 상세 삭제 실패');
	}
	return res.data;
};

export const searchShipmentDetail = async (
	payload: GetSearchShipmentDetailListPayload
) => {
	const res = await FetchApiGet('/sales/shipment/detail/search', payload);
	if (res.status !== 'success') {
		throw new Error('납품 상세 검색 실패');
	}
	return res.data;
};

export const getShipmentDetailFieldName = async (fieldName: string) => {
	const res = await FetchApiGet(`/sales/shipment/detail/fields/${fieldName}`);
	if (res.status !== 'success') {
		throw new Error('납품 상세 필드 조회 실패');
	}
	return res.data;
};

export const getShipmentDetailListById = async (
	shipmentMasterId: number,
	page: number = 0,
	size: number = 10
) => {
	const res = await FetchApiGet('/sales/shipment/detail', {
		shipmentMasterId,
		page,
		size,
	});
	if (res.status !== 'success') {
		throw new Error(`출하 ID ${shipmentMasterId}의 상세 목록 조회 실패`);
	}
	return res.data;
};
