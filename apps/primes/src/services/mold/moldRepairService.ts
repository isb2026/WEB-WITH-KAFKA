import {
	FetchApiPost,
	FetchApiGet,
	FetchApiPut,
	FetchApiDelete,
} from '@primes/utils/request';
import {
	MoldRepairDto,
	MoldRepairSearchRequest,
	MoldRepairListCreateRequest,
	MoldRepairCreateRequest,
} from '@primes/types/mold';

// MoldRepair Master API calls
export const getMoldRepairList = async (
	searchRequest: MoldRepairSearchRequest = {},
	page: number = 0,
	size: number = 10
): Promise<{ status: string; data: MoldRepairDto[]; message: string }> => {
	// Flatten search parameters - send them as flat query parameters, not nested searchRequest object
	const params = {
		page,
		size,
		...searchRequest, // Spread search fields directly
	};

	const res = await FetchApiGet('mold/mold-repair', params);
	console.log('MoldRepair API Response:', res);
	console.log('MoldRepair API Response data:', res.data);
	console.log('MoldRepair API Response data type:', typeof res.data);

	if (res.status !== 'success') {
		throw new Error('MoldRepair 목록 조회 실패');
	}
	return res.data;
};

export const createMoldRepair = async (
	data: MoldRepairListCreateRequest | MoldRepairCreateRequest[]
): Promise<MoldRepairDto[]> => {
	// Backend now expects array format directly, not wrapped in dataList
	let payload: MoldRepairCreateRequest[];

	if (Array.isArray(data)) {
		// Direct array format (new format)
		payload = data;
	} else if (data.dataList && Array.isArray(data.dataList)) {
		// Legacy format with dataList wrapper (backward compatibility)
		payload = data.dataList;
	} else {
		// Fallback - treat as single item and wrap in array
		payload = [data as MoldRepairCreateRequest];
	}

	console.log(
		'MoldRepair payload (array format):',
		JSON.stringify(payload, null, 2)
	);

	const res = await FetchApiPost('mold/mold-repair', payload);
	if (res.status !== 'success') {
		throw new Error('MoldRepair 생성 실패');
	}
	return res.data;
};

export const updateMoldRepair = async (
	id: number,
	data: Partial<MoldRepairDto>
): Promise<MoldRepairDto> => {
	// Fields that should NOT be sent in update requests (system-managed fields)
	const systemFields = [
		'id', 'tenantId', 'isDelete', 'createdAt', 'createdBy', 
		'updatedAt', 'updatedBy'
	];

	// Clean the data - remove undefined values and system-managed fields
	const cleanData = (obj: any) => {
		const cleaned: any = {};
		Object.keys(obj).forEach(key => {
			// Skip system-managed fields
			if (systemFields.includes(key)) {
				return;
			}
			
			const value = obj[key];
			if (value !== undefined && value !== null && value !== '') {
				cleaned[key] = value;
			}
		});
		return cleaned;
	};

	const cleanedData = cleanData(data);
	
	// For PUT /mold/mold-repair/{id} - send object format (not array)
	// The ID is already in the URL, so don't include it in the payload
	console.log(
		'Update payload (object format for PUT with ID):',
		JSON.stringify(cleanedData, null, 2)
	);

	const res = await FetchApiPut(`mold/mold-repair/${id}`, cleanedData);
	if (res.status !== 'success') {
		console.error('Update failed:', res);
		throw new Error(`MoldRepair 수정 실패: ${res.errorMessage || res.message || 'Unknown error'}`);
	}
	return res.data;
};

export const deleteMoldRepair = async (ids: number[]): Promise<any> => {
	console.log('=== deleteMoldRepair DEBUG ===');
	console.log('IDs to delete:', ids);

	const res = await FetchApiDelete('mold/mold-repair', undefined, ids);
	console.log('Delete response:', res);

	if (res.status !== 'success') {
		throw new Error('MoldRepair 삭제 실패');
	}
	return res.data;
};
