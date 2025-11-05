import {
	FetchApiPost,
	FetchApiGet,
	FetchApiPut,
	FetchApiDelete,
} from '@primes/utils/request';
import {
	MoldOrderDetailDto,
	MoldOrderDetailSearchRequest,
	MoldOrderDetailCreateRequest,
} from '@primes/types/mold';

// MoldOrderDetail API calls
export const getMoldOrderDetailList = async (
	searchRequest: MoldOrderDetailSearchRequest = {},
	page: number = 0,
	size: number = 10
): Promise<{ status: string; data: MoldOrderDetailDto[]; message: string }> => {
	// Flatten search parameters - send them as flat query parameters, not nested searchRequest object
	const params = {
		page,
		size,
		...searchRequest, // Spread search fields directly
	};

	const res = await FetchApiGet('mold/mold-order/detail', params);
	if (res.status !== 'success') {
		throw new Error('MoldOrderDetail 목록 조회 실패');
	}
	return res.data;
};

export const createMoldOrderDetail = async (data: MoldOrderDetailCreateRequest[]): Promise<MoldOrderDetailDto[]> => {
	const res = await FetchApiPost('mold/mold-order/detail', data);
	if (res.status !== 'success') {
		throw new Error('MoldOrderDetail 생성 실패');
	}
	// Return the first item from the array response
	return Array.isArray(res.data) ? res.data[0] : res.data;
};

export const updateMoldOrderDetail = async (
	id: number,
	data: Partial<MoldOrderDetailDto>
): Promise<MoldOrderDetailDto> => {
	const res = await FetchApiPut(`mold/mold-order/detail/${id}`, data);
	if (res.status !== 'success') {
		throw new Error('MoldOrderDetail 수정 실패');
	}
	return res.data;
};

export const deleteMoldOrderDetail = async (ids: number[]): Promise<any> => {
	const res = await FetchApiDelete('mold/mold-order/detail', ids);
	if (res.status !== 'success') {
		throw new Error('MoldOrderDetail 삭제 실패');
	}
	return res.data;
};

export const getMoldOrderDetailFields = async (
	fieldName: string
): Promise<any> => {
	const res = await FetchApiGet(`mold/mold-order/detail/fields/${fieldName}`);
	if (res.status !== 'success') {
		throw new Error('MoldOrderDetail 필드 조회 실패');
	}
	return res.data;
};
