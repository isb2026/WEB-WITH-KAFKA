import {
	FetchApiPost,
	FetchApiGet,
	FetchApiPut,
	FetchApiDelete,
} from '@primes/utils/request';
import {
	MoldInoutInformationDto,
	MoldInoutInformationSearchRequest,
	MoldInoutInformationListCreateRequest,
} from '@primes/types/mold';

// MoldInoutInformation Master API calls
export const getMoldInoutInformationList = async (
	searchRequest: MoldInoutInformationSearchRequest = {},
	page: number = 0,
	size: number = 10
): Promise<{
	status: string;
	data: MoldInoutInformationDto[];
	message: string;
}> => {
	// Flatten search parameters - send them as flat query parameters, not nested searchRequest object
	const params = {
		page,
		size,
		...searchRequest, // Spread search fields directly
	};

	const res = await FetchApiGet('mold/mold-inout-information', params);
	if (res.status !== 'success') {
		throw new Error('MoldInoutInformation 목록 조회 실패');
	}
	return res.data;
};

export const createMoldInoutInformation = async (
	data: MoldInoutInformationListCreateRequest
): Promise<MoldInoutInformationDto[]> => {
	console.log(
		'Creating mold inout information with endpoint: mold/mold-inout-information'
	);
	console.log('Request data:', data);
	console.log('Request data JSON:', JSON.stringify(data, null, 2));

	// Backend expects array format for POST requests (like other mold services)
	const payload = data.dataList;
	console.log('Sending as array payload:', payload);
	console.log('Array payload JSON:', JSON.stringify(payload, null, 2));

	try {
		const res = await FetchApiPost('mold/mold-inout-information', payload);
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
				`MoldInoutInformation 생성 실패: ${res.errorMessage || res.message || 'Unknown error'}`
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

export const updateMoldInoutInformation = async (
	id: number,
	data: Partial<MoldInoutInformationDto>
): Promise<MoldInoutInformationDto> => {
	const res = await FetchApiPut(`mold/mold-inout-information/${id}`, data);
	if (res.status !== 'success') {
		throw new Error('MoldInoutInformation 수정 실패');
	}
	return res.data;
};

export const deleteMoldInoutInformation = async (
	ids: number[]
): Promise<any> => {
	console.log(
		'Deleting mold inout information with endpoint: mold/mold-inout-information'
	);
	console.log('Delete IDs:', ids);
	console.log('Request data JSON:', JSON.stringify(ids, null, 2));

	const res = await FetchApiDelete(
		'mold/mold-inout-information',
		undefined,
		ids
	);
	console.log('Delete response:', res);

	if (res.status !== 'success') {
		console.error('API delete error response:', res);
		throw new Error(
			`MoldInoutInformation 삭제 실패: ${res.errorMessage || res.message || 'Unknown error'}`
		);
	}
	return res.data;
};

// Get mold inout information records for right table
export const getMoldInoutInformationRecords = async (
	outCommandId?: number,
	page: number = 0,
	size: number = 10,
	inoutFlag?: boolean
): Promise<{
	status: string;
	data: {
		content: MoldInoutInformationDto[];
		pageable: any;
		totalElements: number;
		totalPages: number;
		last: boolean;
		size: number;
		number: number;
		sort: any;
		numberOfElements: number;
		first: boolean;
		empty: boolean;
	};
	message: string | null;
}> => {
	const params: any = { page, size };
	
	// outCommandId가 있을 때만 필터링 파라미터 추가
	if (outCommandId) {
		params.outCommandId = outCommandId;
	}
	
	// inoutFlag가 정의되어 있을 때만 필터링 파라미터 추가
	if (inoutFlag !== undefined) {
		params.inoutFlag = inoutFlag;
	}
	
	const res = await FetchApiGet('mold/mold-inout-information', params);
	if (res.status !== 'success') {
		throw new Error('MoldInoutInformation 레코드 조회 실패');
	}
	return {
		status: res.status || 'success',
		data: res.data,
		message: null
	};
};
