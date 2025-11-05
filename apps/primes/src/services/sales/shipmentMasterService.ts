import {
	FetchApiPost,
	FetchApiGet,
	FetchApiPut,
	FetchApiDelete,
} from '@primes/utils/request';
import {
	GetAllShipmentListPayload,
	GetAllShipmentListWithDetailPayload,
} from '@primes/types/sales/shipmentMaster';
import { GetSearchShipmentMasterListPayload } from '@primes/types/sales/shipmentMaster';
import {
	CreateShipmentMasterPayload,
	UpdateShipmentMasterPayload,
} from '@primes/types/sales/shipmentMaster';

export const getAllShipmentMasterList = async (
	payload: GetAllShipmentListPayload
) => {
	const res = await FetchApiGet('/sales/shipment/master', payload);
	if (res.status !== 'success') {
		throw new Error('주문 마스터 목록 조회 실패');
	}
	return res.data;
};

export const getAllShipmentListWithDetail = async (
	payload: GetAllShipmentListWithDetailPayload
) => {
	const res = await FetchApiGet(
		'/sales/shipment/master/with-details',
		payload
	);
	if (res.status !== 'success') {
		throw new Error('주문 목록 조회 실패');
	}
	return res.data;
};

export const createShipmentMaster = async (
	data: CreateShipmentMasterPayload
) => {
	const res = await FetchApiPost('/sales/shipment/master', data);
	if (res.status !== 'success') {
		throw new Error('주문 마스터 생성 실패');
	}
	return res.data;
};

export const updateShipmentMaster = async (
	id: number,
	data: Partial<UpdateShipmentMasterPayload>
) => {
	const res = await FetchApiPut(`/sales/shipment/master/${id}`, data);
	if (res.status !== 'success') {
		throw new Error('주문 마스터 수정 실패');
	}
	return res.data;
};

export const deleteShipmentMaster = async (ids: number[]) => {
	const res = await FetchApiDelete(`/sales/shipment/master`, undefined, ids);
	if (res.status !== 'success') {
		throw new Error('주문 마스터 삭제 실패');
	}
	return res.data;
};

export const searchShipmentMaster = async (
	payload: GetSearchShipmentMasterListPayload
) => {
	const res = await FetchApiGet('/sales/shipment/master/search', payload);
	if (res.status !== 'success') {
		throw new Error('주문 마스터 검색 실패');
	}
	return res.data;
};

export const getShipmentMasterFieldName = async (fieldName: string) => {
	const res = await FetchApiGet(`/sales/shipment/master/fields/${fieldName}`);
	if (res.status !== 'success') {
		throw new Error('주문 마스터 필드 조회 실패');
	}
	return res.data;
};

export const getShipmentMasterById = async (params: {
	id: number;
	page: number;
	size: number;
}) => {
	const res = await FetchApiGet('/sales/shipment/master', params);
	if (res.status !== 'success') {
		throw new Error('주문 정보 조회 실패');
	}
	return res.data;
};
