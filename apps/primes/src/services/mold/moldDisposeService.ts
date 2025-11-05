import {
	FetchApiPost,
	FetchApiGet,
	FetchApiPut,
	FetchApiDelete,
} from '@primes/utils/request';
import { MoldDisposeDto, MoldDisposeSearchRequest, MoldDisposeCreateRequest } from '@primes/types/mold';

// MoldDispose Master API calls
export const getMoldDisposeList = async (
	searchRequest: MoldDisposeSearchRequest = {},
	page: number = 0,
	size: number = 10
): Promise<{ status: string; data: MoldDisposeDto[]; message: string }> => {
	// Flatten search parameters - send them as flat query parameters, not nested searchRequest object
	const params = {
		page,
		size,
		...searchRequest  // Spread search fields directly
	};
	
	const res = await FetchApiGet('mold/mold-dispose', params);
	if (res.status !== 'success') {
		throw new Error('MoldDispose 목록 조회 실패');
	}
	return res.data;
};

export const createMoldDispose = async (data: MoldDisposeCreateRequest): Promise<MoldDisposeDto> => {
	console.log('Creating mold dispose with endpoint: mold/mold-dispose');
	console.log('Request data:', data);
	
	// Send data as direct array as expected by the backend
	const requestData = [data];
	
	console.log('Sending request as direct array:', requestData);
	console.log('Request data JSON:', JSON.stringify(requestData, null, 2));
	const res = await FetchApiPost('mold/mold-dispose', requestData);
	console.log('Response:', res);
	
	if (res.status !== 'success') {
		console.error('API error response:', res);
		throw new Error(`MoldDispose 생성 실패: ${res.message || 'Unknown error'}`);
	}
	return res.data;
};

export const updateMoldDispose = async (id: number, data: Partial<MoldDisposeDto>): Promise<MoldDisposeDto> => {
	const res = await FetchApiPut(`mold/mold-dispose/${id}`, data);
	if (res.status !== 'success') {
		throw new Error('MoldDispose 수정 실패');
	}
	return res.data;
};

export const deleteMoldDispose = async (ids: number[]): Promise<any> => {
	const res = await FetchApiDelete('mold/mold-dispose', undefined, ids);
	if (res.status !== 'success') {
		throw new Error('MoldDispose 삭제 실패');
	}
	return res.data;
};