import {
	FetchApiPost,
	FetchApiGet,
	FetchApiPut,
	FetchApiDelete,
} from '@primes/utils/request';
import { getSearchParams } from '@primes/utils/request';
import {
	MoldMasterDto,
	MoldMasterCreateRequest,
	MoldMasterUpdateRequest,
	MoldMasterSearchRequest,
} from '@primes/types/mold';

// MoldMaster List
export const getMoldMasterList = async (
	params: {
		page?: number;
		size?: number;
		searchRequest?: MoldMasterSearchRequest;
	} = {}
) => {
	const { page = 0, size = 10, searchRequest = {} } = params;
	const searchParams = getSearchParams(searchRequest);
	const url = `/mold/master?page=${page}&size=${size}&${searchParams}`;

	const res = await FetchApiGet(url);

	if (res.status !== 'success') {
		throw new Error(res.errorMessage || 'MoldMaster 목록 조회 실패');
	}
	return res.data;
};

// MoldMaster by ID
export const getMoldMasterById = async (id: number) => {
	const res = await FetchApiGet(`/mold/master/${id}`);
	if (res.status !== 'success') {
		throw new Error(res.errorMessage || 'MoldMaster 조회 실패');
	}
	return res.data;
};

// MoldMaster Create
export const createMoldMaster = async (data: MoldMasterCreateRequest) => {
	console.log('=== MOLD MASTER CREATE DEBUG ===');
	console.log('Input data:', data);
	console.log('Input data type:', typeof data);
	console.log('Input data keys:', Object.keys(data));

	// Validate required fields before sending
	if (
		!data.moldType ||
		!data.moldName ||
		!data.moldStandard ||
		!data.manageType
	) {
		throw new Error(
			'Required fields are missing: moldType, moldName, moldStandard, manageType'
		);
	}

	if (
		data.lifeCycle === undefined ||
		data.lifeCycle === null ||
		data.lifeCycle <= 0
	) {
		throw new Error('lifeCycle must be a positive number');
	}

	if (
		data.moldPrice === undefined ||
		data.moldPrice === null ||
		data.moldPrice <= 0
	) {
		throw new Error('moldPrice must be a positive number');
	}

	// Send all required fields to match new backend schema
	const cleanedParams: Record<string, any> = {
		moldType: String(data.moldType).trim(),
		moldName: String(data.moldName).trim(),
		moldStandard: String(data.moldStandard).trim(),
		lifeCycle: Number(data.lifeCycle),
		moldPrice: Number(data.moldPrice),
		manageType: String(data.manageType).trim(), // ✅ Keep as string - backend expects string
	};

	// Optional fields - only include if provided and not empty
	if (data.safeStock !== undefined && data.safeStock !== null) {
		cleanedParams.safeStock = Number(data.safeStock);
	}
	if (data.currentStock !== undefined && data.currentStock !== null) {
		cleanedParams.currentStock = Number(data.currentStock);
	}
	if (data.moldDesign && String(data.moldDesign).trim()) {
		cleanedParams.moldDesign = String(data.moldDesign).trim();
	}
	if (data.moldDesignCode && String(data.moldDesignCode).trim()) {
		cleanedParams.moldDesignCode = String(data.moldDesignCode).trim();
	}
	if (data.moldPicture && String(data.moldPicture).trim()) {
		cleanedParams.moldPicture = String(data.moldPicture).trim();
	}
	if (data.keepPlace && String(data.keepPlace).trim()) {
		cleanedParams.keepPlace = String(data.keepPlace).trim();
	}

	console.log('Cleaned params being sent:', cleanedParams);
	console.log('Cleaned params JSON:', JSON.stringify(cleanedParams, null, 2));

	try {
		// ✅ FIXED: Backend expects array format, not single object
		const requestData = [cleanedParams];
		console.log('Sending array format to backend:', requestData);
		
		const res = await FetchApiPost('/mold/master', requestData);

		console.log('API Response:', res);
		console.log('Response status:', res.status);
		console.log('Response message:', res.message);
		console.log('Response errorMessage:', res.errorMessage);

		return res.data;
	} catch (error: any) {
		console.error('Create MoldMaster failed:', error);
		throw error; // Re-throw to preserve error details
	}
};

// MoldMaster Update
export const updateMoldMaster = async (
	id: number,
	data: MoldMasterUpdateRequest
) => {
	// Send all provided fields to match new backend schema
	const cleanedParams: MoldMasterUpdateRequest = {};

	// Only include fields that are provided (not undefined)
	if (data.isUse !== undefined) cleanedParams.isUse = data.isUse;
	if (data.moldType !== undefined) cleanedParams.moldType = data.moldType;
	if (data.moldCode !== undefined) cleanedParams.moldCode = data.moldCode;
	if (data.moldName !== undefined) cleanedParams.moldName = data.moldName;
	if (data.moldStandard !== undefined)
		cleanedParams.moldStandard = data.moldStandard;
	if (data.lifeCycle !== undefined) cleanedParams.lifeCycle = data.lifeCycle;
	if (data.moldPrice !== undefined) cleanedParams.moldPrice = data.moldPrice;
	if (data.safeStock !== undefined) cleanedParams.safeStock = data.safeStock;
	if (data.currentStock !== undefined)
		cleanedParams.currentStock = data.currentStock;
	if (data.manageType !== undefined)
		cleanedParams.manageType = data.manageType;
	if (data.moldDesign !== undefined)
		cleanedParams.moldDesign = data.moldDesign;
	if (data.moldDesignCode !== undefined)
		cleanedParams.moldDesignCode = data.moldDesignCode;
	if (data.moldPicture !== undefined)
		cleanedParams.moldPicture = data.moldPicture;
	if (data.keepPlace !== undefined) cleanedParams.keepPlace = data.keepPlace;

	const res = await FetchApiPut(`/mold/master/${id}`, cleanedParams);

	if (res.status !== 'success') {
		throw new Error(res.errorMessage || 'MoldMaster 수정 실패');
	}
	return res.data;
};

// MoldMaster Delete (Single)
export const deleteMoldMaster = async (id: number) => {
	// ✅ FIXED: Use same pattern as working moldService.ts
	// Send ID in request body instead of URL path
	const res = await FetchApiDelete('/mold/master', undefined, [id]);
	if (res.status !== 'success') {
		throw new Error(res.errorMessage || 'MoldMaster 삭제 실패');
	}
	return res.data;
};

// MoldMaster Delete (Bulk)
export const deleteMoldMasters = async (ids: number[]) => {
	const res = await FetchApiDelete('/mold/master', undefined, ids);
	if (res.status !== 'success') {
		throw new Error(res.errorMessage || 'MoldMaster 일괄 삭제 실패');
	}
	return res.data;
};

// MoldMaster Field API
export const getMoldMasterField = async (fieldName: string) => {
	const res = await FetchApiGet(`/mold/master/fields/${fieldName}`);
	if (res.status !== 'success') {
		throw new Error('MoldMaster 필드 조회 실패');
	}
	return res.data;
};
