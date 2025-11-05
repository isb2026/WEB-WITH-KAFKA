import {
	FetchApiPost,
	FetchApiGet,
	FetchApiPut,
	FetchApiDelete,
} from '@primes/utils/request';
import { GetAllIncomingDetailListPayload } from '@primes/types/purchase/incomingDetail';
import { GetSearchIncomingDetailListPayload } from '@primes/types/purchase/incomingDetail';
import {
	CreateIncomingDetailPayload,
	UpdateIncomingDetailPayload,
} from '@primes/types/purchase/incomingDetail';

export const getAllIncomingDetailList = async (
	payload: GetAllIncomingDetailListPayload
) => {
	const res = await FetchApiGet('/purchase/incoming/detail', payload);
	if (res.status !== 'success') {
		throw new Error('구매입고 상세 목록 조회 실패');
	}
	return res.data;
};

export const createIncomingDetail = async (
	data: Partial<CreateIncomingDetailPayload>
) => {
	// Debug: Log what we're sending
	console.log('createIncomingDetail - sending data:', data);
	console.log('createIncomingDetail - data JSON:', JSON.stringify(data, null, 2));
	
	// Extract the dataList array and send it directly
	const dataToSend = data.dataList || [];
	console.log('createIncomingDetail - sending dataList directly:', dataToSend);
	
	// Send dataList array directly as expected by backend
	const res = await FetchApiPost('/purchase/incoming/detail', dataToSend);
	if (res.status !== 'success') {
		throw new Error('구매입고 상세 생성 실패');
	}
	return res.data;
};

export const updateIncomingDetail = async (
	id: number,
	data: Partial<UpdateIncomingDetailPayload>
) => {
	const res = await FetchApiPut(`/purchase/incoming/detail/${id}`, data);
	if (res.status !== 'success') {
		throw new Error('구매입고 상세 수정 실패');
	}
	return res.data;
};

export const updateAllIncomingDetail = async (
	data: Partial<UpdateIncomingDetailPayload>[]
) => {
	const res = await FetchApiPut('/purchase/incoming/detail/updateAll', data);
	if (res.status !== 'success') {
		throw new Error('구매입고 상세 일괄 수정 실패');
	}
	return res.data;
};

export const deleteIncomingDetail = async (ids: number[]) => {
	const res = await FetchApiDelete(
		`/purchase/incoming/detail`,
		undefined,
		ids
	);
	if (res.status !== 'success') {
		throw new Error('구매입고 상세 삭제 실패');
	}
	return res.data;
};

export const searchIncomingDetail = async (
	payload: GetSearchIncomingDetailListPayload
) => {
	const res = await FetchApiGet('/purchase/incoming/detail/search', payload);
	if (res.status !== 'success') {
		throw new Error('구매입고 상세 검색 실패');
	}
	return res.data;
};

export const getIncomingDetailFieldName = async (fieldName: string) => {
	const res = await FetchApiGet(
		`/purchase/incoming/detail/fields/${fieldName}`
	);
	if (res.status !== 'success') {
		throw new Error('구매입고 상세 필드 조회 실패');
	}
	return res.data;
};

export const getIncomingDetailListByMasterId = async (
	incomingMasterId: number,
	page: number = 0,
	size: number = 10
) => {
	const res = await FetchApiGet('/purchase/incoming/detail', {
		incomingMasterId,
		page,
		size,
	});
	if (res.status !== 'success') {
		throw new Error(`입고 ID ${incomingMasterId}의 상세 목록 조회 실패`);
	}
	return res.data;
};
