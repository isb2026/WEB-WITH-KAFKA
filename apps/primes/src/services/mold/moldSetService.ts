import {
	FetchApiPost,
	FetchApiGet,
	FetchApiPut,
	FetchApiDelete,
} from '@primes/utils/request';

// MoldSet Master API calls
export const getMoldSetList = async (
	searchRequest: any = {},
	page: number = 0,
	size: number = 10
) => {
	// Flatten search parameters - send them as flat query parameters, not nested searchRequest object
	const params = {
		page,
		size,
		include: 'moldSetDetails,moldInstance', // moldInstance 정보 포함 요청
		...searchRequest  // Spread search fields directly
	};
	
	const res = await FetchApiGet('/mold/mold-set/master', params);
	if (res.status !== 'success') {
		throw new Error('MoldSet 목록 조회 실패');
	}
	return res.data;
};

export const createMoldSet = async (data: any) => {
	const res = await FetchApiPost('/mold/mold-set/master', data);
	if (res.status !== 'success') {
		throw new Error('MoldSet 생성 실패');
	}
	return res.data;
};

export const updateMoldSet = async (id: number, data: any) => {
	const res = await FetchApiPut(`/mold/mold-set/master/${id}`, data);
	if (res.status !== 'success') {
		throw new Error('MoldSet 수정 실패');
	}
	return res.data;
};

export const deleteMoldSet = async (ids: number[]) => {
	const res = await FetchApiDelete('/mold/mold-set/master', ids);
	if (res.status !== 'success') {
		throw new Error('MoldSet 삭제 실패');
	}
	return res.data;
};

// MoldSet Detail API calls
export const getMoldSetDetailList = async (
	searchRequest: any = {},
	page: number = 0,
	size: number = 10
) => {
	// Flatten search parameters - send them as flat query parameters, not nested searchRequest object
	const params = {
		page,
		size,
		...searchRequest  // Spread search fields directly
	};
	
	const res = await FetchApiGet('/mold/mold-set/detail', params);
	if (res.status !== 'success') {
		throw new Error('MoldSet 상세 목록 조회 실패');
	}
	return res.data;
};

export const getMoldSetDetailByMasterId = async (
	masterId: number,
	page: number = 0,
	size: number = 10
) => {
	const params = {
		moldSetMasterId: masterId,
		page,
		size,
	};
	
	const res = await FetchApiGet('/mold/mold-set/detail', params);
	if (res.status !== 'success') {
		throw new Error(`MoldSet ID ${masterId}의 상세 목록 조회 실패`);
	}
	return res.data;
};

export const createMoldSetDetail = async (data: any) => {
	const res = await FetchApiPost('/mold/mold-set/detail', data);
	if (res.status !== 'success') {
		throw new Error('MoldSet 상세 생성 실패');
	}
	return res.data;
};

// 배열 형태로 여러 개의 MoldSet 상세 정보를 일괄 생성
export const createMoldSetDetailBatch = async (detailList: Array<{
	moldSetMasterId: number;
	moldInstanceId: number;
}>) => {
	console.log('createMoldSetDetailBatch - Sending data:', detailList);
	const res = await FetchApiPost('/mold/mold-set/detail', detailList);
	if (res.status !== 'success') {
		throw new Error('MoldSet 상세 일괄 생성 실패');
	}
	return res.data;
};

export const updateMoldSetDetail = async (id: number, data: any) => {
	const res = await FetchApiPut(`/mold/mold-set/detail/${id}`, data);
	if (res.status !== 'success') {
		throw new Error('MoldSet 상세 수정 실패');
	}
	return res.data;
};

export const deleteMoldSetDetail = async (ids: number[]) => {
	const res = await FetchApiDelete('/mold/mold-set/detail', undefined, ids);
	if (res.status !== 'success') {
		throw new Error('MoldSet 상세 삭제 실패');
	}
	return res.data;
};