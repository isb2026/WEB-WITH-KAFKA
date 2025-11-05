import {
	FetchApiPost,
	FetchApiGet,
	FetchApiPut,
	FetchApiDelete,
} from '@primes/utils/request';

// MoldOrder Master API calls
export const getMoldOrderList = async (
	searchRequest: any = {},
	page: number = 0,
	size: number = 10
) => {
	// Flatten search parameters - send them as flat query parameters, not nested searchRequest object
	const params = {
		page,
		size,
		...searchRequest, // Spread search fields directly
	};

	const res = await FetchApiGet('/mold/mold-order', params);
	if (res.status !== 'success') {
		throw new Error('MoldOrder 목록 조회 실패');
	}
	return res.data;
};

export const createMoldOrder = async (data: any) => {
	const res = await FetchApiPost('/mold/mold-order', data);
	if (res.status !== 'success') {
		throw new Error('MoldOrder 생성 실패');
	}
	return res.data;
};

export const updateMoldOrder = async (id: number, data: any) => {
	const res = await FetchApiPut(`/mold/mold-order/${id}`, data);
	if (res.status !== 'success') {
		throw new Error('MoldOrder 수정 실패');
	}
	return res.data;
};

export const deleteMoldOrder = async (ids: number[]) => {
	const res = await FetchApiDelete('/mold/mold-order', ids);
	if (res.status !== 'success') {
		throw new Error('MoldOrder 삭제 실패');
	}
	return res.data;
};

// MoldOrder Detail API calls
export const getMoldOrderDetailList = async (
	searchRequest: any = {},
	page: number = 0,
	size: number = 10
) => {
	// Flatten search parameters - send them as flat query parameters, not nested searchRequest object
	const params = {
		page,
		size,
		...searchRequest, // Spread search fields directly
	};

	const res = await FetchApiGet('/mold/mold-order/detail', params);
	if (res.status !== 'success') {
		throw new Error('MoldOrder 상세 목록 조회 실패');
	}
	return res.data;
};

export const getMoldOrderDetailByMasterId = async (
	masterId: number | string,
	page: number = 0,
	size: number = 10
) => {
	const timestamp = new Date().toISOString();
	const requestId = Math.random().toString(36).substr(2, 9);
	
	console.log(`[${timestamp}] [${requestId}] 🚀 API CALL START - getMoldOrderDetailByMasterId:`, {
		masterId,
		page,
		size,
		url: '/mold/mold-order/detail',
		params: { moldOrderMasterId: masterId, page, size }
	});

	const res = await FetchApiGet('/mold/mold-order/detail', {
		moldOrderMasterId: masterId,
		page,
		size,
	});

	console.log(`[${timestamp}] [${requestId}] ✅ API CALL END - getMoldOrderDetailByMasterId:`, {
		masterId,
		status: res.status,
		dataLength: res.data?.dataList?.length || res.data?.content?.length || 0
	});

	if (res.status !== 'success') {
		throw new Error(`MoldOrder ID ${masterId}의 상세 목록 조회 실패`);
	}

	// Handle the response structure with dataList
	if (res.data && res.data.dataList) {
		return {
			...res.data,
			content: res.data.dataList,
			data: res.data.dataList,
		};
	}

	return res.data;
};

export const createMoldOrderDetail = async (data: any) => {
	// Backend expects array format for POST requests
	const payload = [data];
	const res = await FetchApiPost('/mold/mold-order/detail', payload);
	if (res.status !== 'success') {
		throw new Error('MoldOrder 상세 생성 실패');
	}
	// Return the first item from the array response
	return Array.isArray(res.data) ? res.data[0] : res.data;
};

export const updateMoldOrderDetail = async (id: number, data: any) => {
	const res = await FetchApiPut(`/mold/mold-order/detail/${id}`, data);
	if (res.status !== 'success') {
		throw new Error('MoldOrder 상세 수정 실패');
	}
	return res.data;
};

export const deleteMoldOrderDetail = async (ids: number[]) => {
	const res = await FetchApiDelete('/mold/mold-order/detail', ids);
	if (res.status !== 'success') {
		throw new Error('MoldOrder 상세 삭제 실패');
	}
	return res.data;
};
