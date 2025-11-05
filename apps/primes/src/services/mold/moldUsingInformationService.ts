import {
	FetchApiPost,
	FetchApiGet,
	FetchApiPut,
	FetchApiDelete,
} from '@primes/utils/request';
import {
	MoldUsingInformationDto,
	MoldUsingInformationSearchRequest,
	MoldUsingInformationCreateRequest,
	MoldUsingInformationListCreateRequest,
} from '@primes/types/mold';

// MoldUsingInformation Master API calls
export const getMoldUsingInformationList = async (
	searchRequest: MoldUsingInformationSearchRequest = {},
	page: number = 0,
	size: number = 10
): Promise<{
	status: string;
	data: MoldUsingInformationDto[];
	message: string;
}> => {
	// Flatten search parameters - send them as flat query parameters, not nested searchRequest object
	const params = {
		page,
		size,
		...searchRequest, // Spread search fields directly
	};

	const res = await FetchApiGet('mold/mold-using-information', params);
	if (res.status !== 'success') {
		throw new Error('MoldUsingInformation 목록 조회 실패');
	}
	return res.data;
};

// Create single mold using information (wraps in array for backend)
export const createSingleMoldUsingInformation = async (
	data: MoldUsingInformationCreateRequest
): Promise<MoldUsingInformationDto> => {
	console.log(
		'Creating single mold using information with endpoint: mold/mold-using-information'
	);
	console.log('Request data:', data);

	// Backend expects array format for POST requests
	const payload = [data];
	console.log(
		'Payload (wrapped in array):',
		JSON.stringify(payload, null, 2)
	);

	const res = await FetchApiPost('mold/mold-using-information', payload);
	console.log('Response:', res);

	if (res.status !== 'success') {
		console.error('API error response:', res);
		throw new Error(
			`MoldUsingInformation 생성 실패: ${res.errorMessage || res.message || 'Unknown error'}`
		);
	}
	// Return the first item from the array response
	return Array.isArray(res.data) ? res.data[0] : res.data;
};

// Create multiple mold using information (for bulk operations)
export const createMoldUsingInformation = async (
	data: MoldUsingInformationListCreateRequest
): Promise<MoldUsingInformationDto[]> => {
	console.log(
		'Creating mold using information list with endpoint: mold/mold-using-information'
	);
	console.log('Request data:', data);

	// Backend expects array format for POST requests
	const payload = data.dataList;
	console.log('Payload (array format):', JSON.stringify(payload, null, 2));

	const res = await FetchApiPost('mold/mold-using-information', payload);
	console.log('Response:', res);

	if (res.status !== 'success') {
		console.error('API error response:', res);
		throw new Error(
			`MoldUsingInformation 생성 실패: ${res.errorMessage || res.message || 'Unknown error'}`
		);
	}
	return res.data;
};

export const updateMoldUsingInformation = async (
	id: number,
	data: Partial<MoldUsingInformationDto>
): Promise<MoldUsingInformationDto> => {
	const res = await FetchApiPut(`mold/mold-using-information/${id}`, data);
	if (res.status !== 'success') {
		throw new Error('MoldUsingInformation 수정 실패');
	}
	return res.data;
};

export const deleteMoldUsingInformation = async (
	ids: number[]
): Promise<any> => {
	console.log(
		'Deleting mold using information with endpoint: mold/mold-using-information'
	);
	console.log('Delete IDs:', ids);
	console.log('Request data JSON:', JSON.stringify(ids, null, 2));

	const res = await FetchApiDelete(
		'mold/mold-using-information',
		undefined,
		ids
	);
	console.log('Delete response:', res);

	if (res.status !== 'success') {
		console.error('API delete error response:', res);
		throw new Error(
			`MoldUsingInformation 삭제 실패: ${res.errorMessage || res.message || 'Unknown error'}`
		);
	}
	return res.data;
};
