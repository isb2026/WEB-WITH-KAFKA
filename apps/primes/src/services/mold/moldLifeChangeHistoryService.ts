import {
	FetchApiPost,
	FetchApiGet,
	FetchApiPut,
	FetchApiDelete,
} from '@primes/utils/request';
import {
	MoldLifeChangeHistoryDto,
	MoldLifeChangeHistorySearchRequest,
	MoldLifeChangeHistoryListCreateRequest,
} from '@primes/types/mold';

// MoldLifeChangeHistory Master API calls
export const getMoldLifeChangeHistoryList = async (
	searchRequest: MoldLifeChangeHistorySearchRequest = {},
	page: number = 0,
	size: number = 10
): Promise<{
	status: string;
	data: MoldLifeChangeHistoryDto[];
	message: string;
}> => {
	// Flatten search parameters - send them as flat query parameters, not nested searchRequest object
	const params = {
		page,
		size,
		...searchRequest, // Spread search fields directly
	};

	const res = await FetchApiGet('mold/mold-life-change-history', params);
	if (res.status !== 'success') {
		throw new Error('MoldLifeChangeHistory 목록 조회 실패');
	}
	return res.data;
};

export const createMoldLifeChangeHistory = async (
	data: MoldLifeChangeHistoryListCreateRequest
): Promise<MoldLifeChangeHistoryDto[]> => {
	console.log(
		'Creating mold life change history with endpoint: mold/mold-life-change-history'
	);
	console.log('Request data:', data);
	console.log('Request data JSON:', JSON.stringify(data, null, 2));

	// Backend now expects array format directly, not wrapped in dataList
	const payload = data.dataList || data;
	console.log('Payload (array format):', JSON.stringify(payload, null, 2));

	try {
		const res = await FetchApiPost(
			'mold/mold-life-change-history',
			payload
		);
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
				`MoldLifeChangeHistory 생성 실패: ${res.errorMessage || res.message || 'Unknown error'}`
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

export const updateMoldLifeChangeHistory = async (
	id: number,
	data: Partial<MoldLifeChangeHistoryDto>
): Promise<MoldLifeChangeHistoryDto> => {
	const res = await FetchApiPut(`mold/mold-life-change-history/${id}`, data);
	if (res.status !== 'success') {
		throw new Error('MoldLifeChangeHistory 수정 실패');
	}
	return res.data;
};

export const deleteMoldLifeChangeHistory = async (
	ids: number[]
): Promise<any> => {
	console.log(
		'Deleting mold life change history with endpoint: mold/mold-life-change-history'
	);
	console.log('Delete IDs:', ids);
	console.log('Request data JSON:', JSON.stringify(ids, null, 2));

	const res = await FetchApiDelete(
		'mold/mold-life-change-history',
		undefined,
		ids
	);
	console.log('Delete response:', res);

	if (res.status !== 'success') {
		console.error('API delete error response:', res);
		throw new Error(
			`MoldLifeChangeHistory 삭제 실패: ${res.errorMessage || res.message || 'Unknown error'}`
		);
	}
	return res.data;
};
