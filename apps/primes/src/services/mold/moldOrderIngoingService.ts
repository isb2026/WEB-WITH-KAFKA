import {
	FetchApiPost,
	FetchApiGet,
	FetchApiPut,
	FetchApiDelete,
} from '@primes/utils/request';
import {
	MoldOrderIngoingDto,
	MoldOrderIngoingSearchRequest,
	MoldOrderIngoingListCreateRequest,
} from '@primes/types/mold';

// MoldOrderIngoing Master API calls
export const getMoldOrderIngoingList = async (
	searchRequest: MoldOrderIngoingSearchRequest = {},
	page: number = 0,
	size: number = 10
): Promise<{
	status: string;
	data: MoldOrderIngoingDto[];
	message: string;
}> => {
	// Flatten search parameters - send them as flat query parameters, not nested searchRequest object
	const params = {
		page,
		size,
		...searchRequest, // Spread search fields directly
	};

	const res = await FetchApiGet('mold/mold-order-ingoing', params);
	if (res.status !== 'success') {
		throw new Error('MoldOrderIngoing 목록 조회 실패');
	}
	return res.data;
};

export const createMoldOrderIngoing = async (
	data: MoldOrderIngoingListCreateRequest
): Promise<MoldOrderIngoingDto[]> => {
	// Backend now expects array format directly, not wrapped in dataList
	const payload = data.dataList || data;
	console.log(
		'MoldOrderIngoing payload (array format):',
		JSON.stringify(payload, null, 2)
	);

	const res = await FetchApiPost('mold/mold-order-ingoing', payload);
	if (res.status !== 'success') {
		throw new Error('MoldOrderIngoing 생성 실패');
	}
	return res.data;
};

export const updateMoldOrderIngoing = async (
	id: number,
	data: Partial<MoldOrderIngoingDto>
): Promise<MoldOrderIngoingDto> => {
	console.log('Service sending data:', JSON.stringify(data, null, 2));
	try {
		// Try sending as array format like POST request
		const res = await FetchApiPut(`mold/mold-order-ingoing`, [data]);
		if (res.status !== 'success') {
			throw new Error('MoldOrderIngoing 수정 실패');
		}
		return res.data;
	} catch (error: any) {
		console.error('API Error Response:', error.response?.data);
		console.error('API Error Status:', error.response?.status);
		console.error('API Error Message:', error.message);
		throw error;
	}
};

export const deleteMoldOrderIngoing = async (ids: number[]): Promise<any> => {
	const res = await FetchApiDelete('mold/mold-order-ingoing', ids);
	if (res.status !== 'success') {
		throw new Error('MoldOrderIngoing 삭제 실패');
	}
	return res.data;
};

export const getMoldOrderIngoingById = async (id: number): Promise<MoldOrderIngoingDto> => {
	const res = await FetchApiGet(`mold/mold-order-ingoing/fields/${id}`);
	if (res.status !== 'success') {
		throw new Error('MoldOrderIngoing 상세 조회 실패');
	}
	return res.data;
};
