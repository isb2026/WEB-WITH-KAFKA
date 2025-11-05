import {
	FetchApiPost,
	FetchApiGet,
	FetchApiPut,
	FetchApiDelete,
} from '@primes/utils/request';
import {
	MoldOrderMasterDto,
	MoldOrderMasterSearchRequest,
	MoldOrderMasterCreateRequest,
} from '@primes/types/mold';

// MoldOrderMaster API calls
export const getMoldOrderMasterList = async (
	searchRequest: MoldOrderMasterSearchRequest = {},
	page: number = 0,
	size: number = 10
): Promise<{ status: string; data: MoldOrderMasterDto[]; message: string }> => {
	console.log('Fetching mold order master list with params:', {
		searchRequest,
		page,
		size,
	});

	// Flatten search parameters - send them as flat query parameters, not nested searchRequest object
	const params = {
		page,
		size,
		...searchRequest, // Spread search fields directly
	};

	const res = await FetchApiGet('mold/mold-order/master', params);

	console.log('Mold order master list response:', res);

	if (res.status !== 'success') {
		throw new Error('MoldOrderMaster 목록 조회 실패');
	}

	// Handle different response structures
	if (res.data && res.data.dataList) {
		return {
			status: 'success',
			data: res.data.dataList,
			message: 'MoldOrderMaster 목록 조회 성공',
		};
	} else if (res.data && Array.isArray(res.data)) {
		return {
			status: 'success',
			data: res.data,
			message: 'MoldOrderMaster 목록 조회 성공',
		};
	} else if (res.data && res.data.content) {
		return {
			status: 'success',
			data: res.data.content,
			message: 'MoldOrderMaster 목록 조회 성공',
		};
	}

	return res.data;
};

export const createMoldOrderMaster = async (
	data: MoldOrderMasterCreateRequest
): Promise<MoldOrderMasterDto> => {
	console.log('=== CREATE MOLD ORDER MASTER DEBUG ===');
	console.log('Input data type:', typeof data);
	console.log('Input data:', JSON.stringify(data, null, 2));
	console.log('Data validation:');
	console.log('- accountMonth:', data.accountMonth, '(type:', typeof data.accountMonth, ')');
	console.log('- orderDate:', data.orderDate, '(type:', typeof data.orderDate, ')');
	console.log('- itemId:', data.itemId, '(type:', typeof data.itemId, ')');
	console.log(
		'- progressId:',
		data.progressId,
		'(type:',
		typeof data.progressId,
		')'
	);
	console.log(
		'- progressName:',
		data.progressName,
		'(type:',
		typeof data.progressName,
		')'
	);
	console.log(
		'- inRequestDate:',
		data.inRequestDate,
		'(type:',
		typeof data.inRequestDate,
		')'
	);
	console.log(
		'- moldVendorId:',
		data.moldVendorId,
		'(type:',
		typeof data.moldVendorId,
		')'
	);
	console.log('- isDev:', data.isDev, '(type:', typeof data.isDev, ')');
	console.log(
		'- isChange:',
		data.isChange,
		'(type:',
		typeof data.isChange,
		')'
	);
	console.log('- isEnd:', data.isEnd, '(type:', typeof data.isEnd, ')');
	console.log('- endDate:', data.endDate, '(type:', typeof data.endDate, ')');
	console.log('- isClose:', data.isClose, '(type:', typeof data.isClose, ')');
	console.log(
		'- closeName:',
		data.closeName,
		'(type:',
		typeof data.closeName,
		')'
	);
	console.log(
		'- closeTime:',
		data.closeTime,
		'(type:',
		typeof data.closeTime,
		')'
	);
	console.log('- isAdmit:', data.isAdmit, '(type:', typeof data.isAdmit, ')');
	console.log(
		'- admitName:',
		data.admitName,
		'(type:',
		typeof data.admitName,
		')'
	);
	console.log(
		'- admitTime:',
		data.admitTime,
		'(type:',
		typeof data.admitTime,
		')'
	);
	console.log(
		'- moldType:',
		data.moldType,
		'(type:',
		typeof data.moldType,
		')'
	);
	console.log('- inType:', data.inType, '(type:', typeof data.inType, ')');

	try {
		console.log('Making API call to: mold/mold-order/master');
		// Backend expects single object format for POST requests
		console.log(
			'Payload (single object):',
			JSON.stringify(data, null, 2)
		);

		const res = await FetchApiPost('mold/mold-order/master', data);
		console.log('=== API RESPONSE ===');
		console.log('Response status:', res.status);
		console.log('Response data:', res.data);
		console.log('Response message:', res.message);
		console.log('Full response:', JSON.stringify(res, null, 2));

		if (res.status !== 'success') {
			console.error('API error response:', res);
			throw new Error(
				`MoldOrderMaster 생성 실패: ${res.message || 'Unknown error'}`
			);
		}

		// Return the response data directly
		return res.data;
	} catch (error) {
		console.error('=== API CALL FAILED ===');
		console.error('Error type:', typeof error);
		console.error(
			'Error message:',
			error instanceof Error ? error.message : error
		);
		console.error('Full error:', error);

		if (error instanceof Error) {
			throw error;
		}
		throw new Error('MoldOrderMaster 생성 실패: Network error');
	}
};

export const updateMoldOrderMaster = async (
	id: number | string,
	data: Partial<MoldOrderMasterDto>
): Promise<MoldOrderMasterDto> => {
	const res = await FetchApiPut(`mold/mold-order/master/${id}`, data);
	if (res.status !== 'success') {
		throw new Error(
			`MoldOrderMaster 수정 실패: ${res.message || res.errorMessage || 'Unknown error'}`
		);
	}
	return res.data;
};

export const deleteMoldOrderMaster = async (ids: number[]): Promise<any> => {
	console.log('Deleting mold order masters with IDs:', ids);
	console.log(
		'Request format - URL: mold/mold-order/master, params: undefined, data:',
		ids
	);

	// Try the exact same pattern as working sales order delete
	const res = await FetchApiDelete('mold/mold-order/master', undefined, ids);

	console.log('Delete response status:', res.status);
	console.log('Delete response:', res);

	if (res.status !== 'success') {
		console.error('Delete failed with response:', res);
		throw new Error(
			res.errorMessage || res.message || 'MoldOrderMaster 삭제 실패'
		);
	}
	return res.data;
};

export const getMoldOrderMasterFields = async (
	fieldName: string
): Promise<any> => {
	const res = await FetchApiGet(`mold/mold-order/master/fields/${fieldName}`);
	if (res.status !== 'success') {
		throw new Error('MoldOrderMaster 필드 조회 실패');
	}
	return res.data;
};

export const getMoldOrderMasterById = async (
	id: number | string
): Promise<MoldOrderMasterDto> => {
	const res = await FetchApiGet(`mold/mold-order/master/${id}`);
	if (res.status !== 'success') {
		throw new Error('MoldOrderMaster 조회 실패');
	}
	return res.data;
};
