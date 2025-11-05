import {
	FetchApiPost,
	FetchApiGet,
	FetchApiPut,
	FetchApiDelete,
	getSearchParams,
} from '@primes/utils/request';
import {
	MoldMasterDto,
	MoldMasterSearchRequest,
	MoldMasterCreateRequest,
} from '@primes/types/mold';

// Mold Master API calls
export const getMoldList = async (
	searchRequest: MoldMasterSearchRequest = {},
	page: number = 0,
	size: number = 10
): Promise<{ status: string; data: MoldMasterDto[]; message: string }> => {
	// Pass search parameters as a separate params object to FetchApiGet
	const params = {
		page,
		size,
		...searchRequest,
	};
	
	const res = await FetchApiGet('mold/master', params);
	
	
	if (res.status !== 'success') {
		console.error('API error:', res);
		throw new Error('Mold 목록 조회 실패');
	}

	// 다양한 응답 구조 처리
	let moldData: MoldMasterDto[] = [];

	if (res.data && Array.isArray(res.data)) {
		moldData = res.data;
	} else if (res.data && res.data.data && Array.isArray(res.data.data)) {
		moldData = res.data.data;
	} else if (
		res.data &&
		res.data.content &&
		Array.isArray(res.data.content)
	) {
		moldData = res.data.content;
	} else if (res.data && res.data.items && Array.isArray(res.data.items)) {
		moldData = res.data.items;
	} else if (Array.isArray(res)) {
		moldData = res;
	} else {
		console.warn('Unexpected response structure:', res);
		moldData = [];
	}

	console.log('Processed mold data:', moldData);

	return {
		status: 'success',
		data: moldData,
		message: 'Mold 목록 조회 성공',
	};
};

export const createMold = async (data: MoldMasterCreateRequest): Promise<MoldMasterDto> => {
	console.log('Creating mold with endpoint: mold/master');
	console.log('Request data:', data);
	console.log('Request data type:', typeof data);
	console.log('Request data keys:', Object.keys(data));

	// Log each field for debugging
	Object.entries(data).forEach(([key, value]) => {
		console.log(`${key}:`, value, '(type:', typeof value, ')');
	});
	
	// Send only the required fields without additional wrapping
	const res = await FetchApiPost('mold/master', data);
	console.log('Response:', res);
	console.log('Response status:', res.status);
	console.log('Response data:', res.data);
	console.log('Response message:', res.message);

	if (res.status !== 'success') {
		console.error('API error response:', res);
		throw new Error(`Mold 생성 실패: ${res.message || 'Unknown error'}`);
	}
	return res.data;
};

export const updateMold = async (id: number, data: Partial<MoldMasterDto>): Promise<MoldMasterDto> => {
	const res = await FetchApiPut(`mold/master/${id}`, data);
	if (res.status !== 'success') {
		throw new Error('Mold 수정 실패');
	}
	return res.data;
};

export const deleteMold = async (ids: number[]): Promise<any> => {
	const res = await FetchApiDelete('mold/master', undefined, ids);
	if (res.status !== 'success') {
		throw new Error('Mold 삭제 실패');
	}
	return res.data;
};
