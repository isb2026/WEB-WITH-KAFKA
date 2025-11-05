import {
	FetchApiPost,
	FetchApiGet,
	FetchApiPut,
	FetchApiDelete,
} from '@primes/utils/request';
import {
	MoldGradeDto,
	MoldGradeSearchRequest,
	MoldGradeCreateRequest,
	MoldGradeListCreateRequest,
} from '@primes/types/mold';

// MoldGrade Master API calls
export const getMoldGradeList = async (
	searchRequest: MoldGradeSearchRequest = {},
	page: number = 0,
	size: number = 10
): Promise<{ status: string; data: MoldGradeDto[]; message: string }> => {
	// Flatten search parameters - send them as flat query parameters, not nested searchRequest object
	const params = {
		page,
		size,
		...searchRequest, // Spread search fields directly
	};

	const res = await FetchApiGet('mold/mold-grade', params);
	if (res.status !== 'success') {
		throw new Error('MoldGrade 목록 조회 실패');
	}
	return res.data;
};

// Create single mold grade (wraps in array for backend)
export const createMoldGrade = async (
	data: MoldGradeCreateRequest
): Promise<MoldGradeDto> => {
	console.log('Creating mold grade with endpoint: mold/mold-grade');
	console.log('Request data:', data);

	// Backend expects array format for POST requests
	const payload = [data];
	console.log(
		'Payload (wrapped in array):',
		JSON.stringify(payload, null, 2)
	);

	const res = await FetchApiPost('mold/mold-grade', payload);
	console.log('Response:', res);

	if (res.status !== 'success') {
		console.error('API error response:', res);
		console.error('Full error response:', JSON.stringify(res, null, 2));
		console.error('Error data details:', res.data);
		throw new Error(
			`MoldGrade 생성 실패: ${res.errorMessage || res.message || 'Unknown error'}`
		);
	}
	// Return the first item from the array response
	return Array.isArray(res.data) ? res.data[0] : res.data;
};

// Create multiple mold grades (for bulk operations)
export const createMoldGradeList = async (
	data: MoldGradeListCreateRequest
): Promise<MoldGradeDto[]> => {
	console.log('Creating mold grade list with endpoint: mold/mold-grade');
	console.log('Request data:', data);

	// Backend expects simple array format
	const payload = data.dataList;
	console.log('Payload (array format):', JSON.stringify(payload, null, 2));

	const res = await FetchApiPost('mold/mold-grade', payload);
	console.log('Response:', res);

	if (res.status !== 'success') {
		console.error('API error response:', res);
		throw new Error(
			`MoldGrade 생성 실패: ${res.errorMessage || res.message || 'Unknown error'}`
		);
	}
	return res.data;
};

export const updateMoldGrade = async (
	id: number,
	data: Partial<MoldGradeDto>
): Promise<MoldGradeDto> => {
	const res = await FetchApiPut(`mold/mold-grade/${id}`, data);
	if (res.status !== 'success') {
		throw new Error('MoldGrade 수정 실패');
	}
	return res.data;
};

export const deleteMoldGrade = async (ids: number[]): Promise<any> => {
	console.log('Deleting mold grade with endpoint: mold/mold-grade');
	console.log('Delete IDs:', ids);
	console.log('Request data JSON:', JSON.stringify(ids, null, 2));

	const res = await FetchApiDelete('mold/mold-grade', undefined, ids);
	console.log('Delete response:', res);

	if (res.status !== 'success') {
		console.error('API delete error response:', res);
		throw new Error(
			`MoldGrade 삭제 실패: ${res.errorMessage || res.message || 'Unknown error'}`
		);
	}
	return res.data;
};
