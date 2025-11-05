import {
	FetchApiPost,
	FetchApiGet,
	FetchApiPut,
	FetchApiDelete,
} from '@primes/utils/request';
import {
	MoldLocationDto,
	MoldLocationSearchRequest,
	MoldLocationListCreateRequest,
} from '@primes/types/mold';

// MoldLocation Master API calls
export const getMoldLocationList = async (
	searchRequest: MoldLocationSearchRequest = {},
	page: number = 0,
	size: number = 10
): Promise<{ status: string; data: MoldLocationDto[]; message: string }> => {
	// Flatten search parameters - send them as flat query parameters, not nested searchRequest object
	const params = {
		page,
		size,
		...searchRequest, // Spread search fields directly
	};

	const res = await FetchApiGet('mold/mold-location', params);
	if (res.status !== 'success') {
		throw new Error('MoldLocation 목록 조회 실패');
	}
	return res.data;
};

export const createMoldLocation = async (
	data: MoldLocationListCreateRequest
): Promise<MoldLocationDto[]> => {
	// Backend now expects array format directly, not wrapped in dataList
	const payload = data.dataList || data;
	console.log(
		'MoldLocation payload (array format):',
		JSON.stringify(payload, null, 2)
	);

	const res = await FetchApiPost('mold/mold-location', payload);
	if (res.status !== 'success') {
		throw new Error('MoldLocation 생성 실패');
	}
	return res.data;
};

export const updateMoldLocation = async (
	id: number,
	data: Partial<MoldLocationDto>
): Promise<MoldLocationDto> => {
	const res = await FetchApiPut(`mold/mold-location/${id}`, data);
	if (res.status !== 'success') {
		throw new Error('MoldLocation 수정 실패');
	}
	return res.data;
};

export const deleteMoldLocation = async (ids: number[]): Promise<any> => {
	const res = await FetchApiDelete('mold/mold-location', ids);
	if (res.status !== 'success') {
		throw new Error('MoldLocation 삭제 실패');
	}
	return res.data;
};

export const getMoldLocationFieldName = async (fieldName: string) => {
	const res = await FetchApiGet(`/mold-location/fields/${fieldName}`);
	if (res.status !== 'success') {
		throw new Error('MoldLocation 필드 조회 실패');
	}
	return res.data;
};
