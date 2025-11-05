import {
	FetchApiPost,
	FetchApiGet,
	FetchApiPut,
	FetchApiDelete,
} from '@primes/utils/request';
import {
	MoldPriceChangeHistoryDto,
	MoldPriceChangeHistorySearchRequest,
	MoldPriceChangeHistoryListCreateRequest,
} from '@primes/types/mold';

// MoldPriceChangeHistory Master API calls
export const getMoldPriceChangeHistoryList = async (
	searchRequest: MoldPriceChangeHistorySearchRequest = {},
	page: number = 0,
	size: number = 10
): Promise<{
	status: string;
	data: MoldPriceChangeHistoryDto[];
	message: string;
}> => {
	// Flatten search parameters - send them as flat query parameters, not nested searchRequest object
	const params = {
		page,
		size,
		...searchRequest, // Spread search fields directly
	};

	const res = await FetchApiGet('mold/mold-price-change-history', params);
	if (res.status !== 'success') {
		throw new Error('MoldPriceChangeHistory 목록 조회 실패');
	}
	return res.data;
};

export const createMoldPriceChangeHistory = async (
	data: MoldPriceChangeHistoryListCreateRequest
): Promise<MoldPriceChangeHistoryDto[]> => {
	// Backend now expects array format directly, not wrapped in dataList
	const payload = data.dataList || data;
	console.log(
		'MoldPriceChangeHistory payload (array format):',
		JSON.stringify(payload, null, 2)
	);

	const res = await FetchApiPost('mold/mold-price-change-history', payload);
	if (res.status !== 'success') {
		throw new Error('MoldPriceChangeHistory 생성 실패');
	}
	return res.data;
};

export const updateMoldPriceChangeHistory = async (
	id: number,
	data: Partial<MoldPriceChangeHistoryDto>
): Promise<MoldPriceChangeHistoryDto> => {
	const res = await FetchApiPut(`mold/mold-price-change-history/${id}`, data);
	if (res.status !== 'success') {
		throw new Error('MoldPriceChangeHistory 수정 실패');
	}
	return res.data;
};

export const deleteMoldPriceChangeHistory = async (
	ids: number[]
): Promise<any> => {
	const res = await FetchApiDelete('mold/mold-price-change-history', ids);
	if (res.status !== 'success') {
		throw new Error('MoldPriceChangeHistory 삭제 실패');
	}
	return res.data;
};
