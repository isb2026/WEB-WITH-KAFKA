import {
	FetchApiPost,
	FetchApiGet,
	FetchApiPut,
	FetchApiDelete,
} from '@primes/utils/request';
import {
	MoldItemRelationDto,
	MoldItemRelationSearchRequest,
	MoldItemRelationCreateRequest,
} from '@primes/types/mold';

// MoldItemRelation Master API calls
export const getMoldItemRelationList = async (
	searchRequest: MoldItemRelationSearchRequest = {},
	page: number = 0,
	size: number = 10
): Promise<{
	status: string;
	data: MoldItemRelationDto[];
	message: string;
}> => {
	// Flatten search parameters - send them as flat query parameters, not nested searchRequest object
	const params = {
		page,
		size,
		...searchRequest, // Spread search fields directly
	};

	const res = await FetchApiGet('mold/mold-item-relation', params);
	if (res.status !== 'success') {
		throw new Error('MoldItemRelation 목록 조회 실패');
	}
	return res.data;
};

export const createMoldItemRelation = async (
	data: MoldItemRelationCreateRequest[]
): Promise<MoldItemRelationDto[]> => {
	console.log(
		'Creating mold item relation with endpoint: mold/mold-item-relation'
	);
	console.log('Request data:', data);
	console.log('Request data JSON:', JSON.stringify(data, null, 2));

	try {
		const res = await FetchApiPost('mold/mold-item-relation', data);
		console.log('Response:', res);

		if (res.status !== 'success') {
			console.error('API error response:', res);
			console.error('Backend error message:', res.errorMessage);
			console.error('Backend error details:', res.data);
			console.error(
				'Full response object:',
				JSON.stringify(res, null, 2)
			);
			throw new Error(
				`MoldItemRelation 생성 실패: ${res.errorMessage || res.message || 'Unknown error'}`
			);
		}
		return res.data;
	} catch (error: any) {
		console.error('=== DETAILED ERROR ANALYSIS ===');
		console.error('Error message:', error.message);
		console.error('Error response status:', error.response?.status);
		console.error('Error response data:', error.response?.data);
		console.error('Error response headers:', error.response?.headers);
		console.error('Request config:', error.config);
		console.error('Full error object:', JSON.stringify(error, null, 2));
		throw error;
	}
};

export const updateMoldItemRelation = async (
	id: number,
	data: Partial<MoldItemRelationDto>
): Promise<MoldItemRelationDto> => {
	const res = await FetchApiPut(`mold/mold-item-relation/${id}`, data);
	if (res.status !== 'success') {
		throw new Error('MoldItemRelation 수정 실패');
	}
	return res.data;
};

export const deleteMoldItemRelation = async (ids: number[]): Promise<any> => {
	console.log(
		'Deleting mold item relation with endpoint: mold/mold-item-relation'
	);
	console.log('Delete IDs:', ids);
	console.log('Request data JSON:', JSON.stringify(ids, null, 2));

	const res = await FetchApiDelete('mold/mold-item-relation', undefined, ids);
	console.log('Delete response:', res);

	if (res.status !== 'success') {
		console.error('API delete error response:', res);
		throw new Error(
			`MoldItemRelation 삭제 실패: ${res.errorMessage || res.message || 'Unknown error'}`
		);
	}
	return res.data;
};
