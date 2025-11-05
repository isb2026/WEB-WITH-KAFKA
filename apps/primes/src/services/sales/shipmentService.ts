import {
	FetchApiPost,
	FetchApiGet,
	FetchApiPut,
	FetchApiDelete,
} from '@primes/utils/request';

// Shipment Master API calls
export const getShipmentList = async (
	searchRequest: any = {},
	page: number = 0,
	size: number = 10
) => {
	const res = await FetchApiGet('/sales/shipment', {
		searchRequest,
		page,
		size,
	});
	if (res.status !== 'success') {
		throw new Error('Shipment 목록 조회 실패');
	}
	return res.data;
};

export const createShipment = async (data: any) => {
	const res = await FetchApiPost('/sales/shipment', data);
	if (res.status !== 'success') {
		throw new Error('Shipment 생성 실패');
	}
	return res.data;
};

export const updateShipment = async (id: number, data: any) => {
	const res = await FetchApiPut(`/sales/shipment/${id}`, data);
	if (res.status !== 'success') {
		throw new Error('Shipment 수정 실패');
	}
	return res.data;
};

export const deleteShipment = async (ids: number[]) => {
	const res = await FetchApiDelete('/sales/shipment', ids);
	if (res.status !== 'success') {
		throw new Error('Shipment 삭제 실패');
	}
	return res.data;
};

// Shipment Detail API calls
export const getShipmentDetailList = async (
	searchRequest: any = {},
	page: number = 0,
	size: number = 10
) => {
	const res = await FetchApiGet('/sales/shipment/detail', {
		searchRequest,
		page,
		size,
	});
	if (res.status !== 'success') {
		throw new Error('Shipment 상세 목록 조회 실패');
	}
	return res.data;
};

export const getShipmentDetailByMasterId = async (
	masterId: number,
	page: number = 0,
	size: number = 10
) => {
	const res = await FetchApiGet('/sales/shipment/detail', {
		searchRequest: { masterId },
		page,
		size,
	});
	if (res.status !== 'success') {
		throw new Error(`Shipment ID ${masterId}의 상세 목록 조회 실패`);
	}
	return res.data;
};

export const createShipmentDetail = async (data: any) => {
	const res = await FetchApiPost('/sales/shipment/detail', data);
	if (res.status !== 'success') {
		throw new Error('Shipment 상세 생성 실패');
	}
	return res.data;
};

export const updateShipmentDetail = async (id: number, data: any) => {
	const res = await FetchApiPut(`/sales/shipment/detail/${id}`, data);
	if (res.status !== 'success') {
		throw new Error('Shipment 상세 수정 실패');
	}
	return res.data;
};

export const deleteShipmentDetail = async (ids: number[]) => {
	const res = await FetchApiDelete('/sales/shipment/detail', ids);
	if (res.status !== 'success') {
		throw new Error('Shipment 상세 삭제 실패');
	}
	return res.data;
};