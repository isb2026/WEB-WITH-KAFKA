import {
	FetchApiPost,
	FetchApiGet,
	FetchApiPut,
	FetchApiDelete,
} from '@primes/utils/request';

// ProgressVendor 연결 생성을 위한 타입 정의
export interface ProgressVendorCreateRequest {
	progressId: number;
	vendorId: number;
	quantity?: number;
	unit?: string;
	unitCost?: number;
	isDefaultVendor?: boolean;
}

// ProgressVendor 연결 생성 (POST /progress-vendors)
export const createProgressVendor = async (data: Partial<ProgressVendorCreateRequest>) => {
	// Extract only allowed keys based on API schema
	const {
		progressId,
		vendorId,
		quantity,
		unit,
		unitCost,
		isDefaultVendor,
	} = data;

	// 필수 필드 검증
	if (!progressId || !vendorId) {
		throw new Error('progressId와 vendorId는 필수 필드입니다');
	}

	const cleanedParams = {
		progressId: Number(progressId),
		vendorId: Number(vendorId),
		unitCost: (unitCost !== undefined && unitCost !== null && String(unitCost).trim() !== '') ? Number(unitCost) : 0,
		quantity: (quantity !== undefined && quantity !== null && String(quantity).trim() !== '') ? Number(quantity) : 0,
		unit: (unit && typeof unit === 'string' && unit.trim() !== '') ? unit.trim() : 'string',
		isDefaultVendor: isDefaultVendor !== undefined ? Boolean(isDefaultVendor) : true,
	};

	console.log('=== API 호출 전 최종 데이터 ===');
	console.log('cleanedParams:', cleanedParams);

	// API가 배열 형태를 기대하므로 배열로 감싸서 전송
	const requestBody = [cleanedParams];
	console.log('=== 최종 Request Body (배열) ===');
	console.log('requestBody:', requestBody);

	const res = await FetchApiPost('/init/progress-vendors', requestBody);
	if (res.status !== 'success') {
		throw new Error(res.errorMessage || 'ProgressVendor 연결 생성 실패');
	}
	return res.data;
};

// ProgressVendor 연결 조회 (GET /progress-vendors)
export const getProgressVendorList = async ({
	searchRequest = {},
	page = 0,
	size = 10,
}: {
	searchRequest?: any;
	page?: number;
	size?: number;
}) => {
	const params = {
		page,
		size,
		...searchRequest,
	};
	
	const res = await FetchApiGet('/init/progress-vendors', params);
	if (res.status !== 'success') {
		throw new Error(res.errorMessage || 'ProgressVendor 목록 조회 실패');
	}
	return res.data;
};

// 특정 공정의 연결된 Vendor 목록 조회 (GET /progress-vendors/item-progress/{progressId}/vendors)
export const getProgressVendorsByProgressId = async (progressId: number) => {
	if (!progressId) {
		throw new Error('progressId가 필요합니다');
	}

	const res = await FetchApiGet(`/init/progress-vendors/item-progress/${progressId}/vendors`);
	if (res.status !== 'success') {
		throw new Error(res.errorMessage || '공정별 Vendor 목록 조회 실패');
	}
	return res.data;
};

// ProgressVendor 연결 수정 (PUT /progress-vendors/{progressId}/{vendorId})
export const updateProgressVendorByCompositeKey = async (progressId: number, vendorId: number, data: Partial<ProgressVendorCreateRequest>) => {
	const {
		quantity,
		unit,
		unitCost,
		isDefaultVendor,
	} = data;

	// 스웨거 API에 맞는 요청 데이터 구조
	const cleanedParams = {
		...(quantity !== undefined && quantity !== null && String(quantity).trim() !== '' && { quantity: Number(quantity) }),
		...(unit && typeof unit === 'string' && unit.trim() !== '' && { unit: unit.trim() }),
		...(unitCost !== undefined && unitCost !== null && String(unitCost).trim() !== '' && { unitCost: Number(unitCost) }),
		...(isDefaultVendor !== undefined && { isDefaultVendor: Boolean(isDefaultVendor) }),
	};

	console.log('=== ProgressVendor 수정 API 호출 ===');
	console.log('URL:', `/init/progress-vendors/${progressId}/${vendorId}`);
	console.log('Body:', cleanedParams);

	const res = await FetchApiPut(`/init/progress-vendors/${progressId}/${vendorId}`, cleanedParams);
	
	console.log('=== ProgressVendor 수정 API 응답 ===');
	console.log('Response:', res);

	if (res.status !== 'success') {
		throw new Error(res.errorMessage || 'ProgressVendor 연결 수정 실패');
	}
	return res.data;
};

// ProgressVendor 연결 삭제 (DELETE /progress-vendors/{id})
export const deleteProgressVendor = async (id: number) => {
	const res = await FetchApiDelete(`/init/progress-vendors/${id}`);
	if (res.status !== 'success') {
		throw new Error(res.errorMessage || 'ProgressVendor 연결 삭제 실패');
	}
	return res.data;
};

// ProgressVendor 연결 삭제 (복합키 사용: DELETE /progress-vendors/{progressId})
export const deleteProgressVendorByCompositeKey = async (progressId: number, vendorId: number) => {
	// vendorId를 배열로 감싸서 body에 전송
	const vendorIds = [vendorId];
	
	console.log('=== ProgressVendor 삭제 API 호출 ===');
	console.log('URL:', `/init/progress-vendors/${progressId}`);
	console.log('Body (vendorIds):', vendorIds);
	
	const res = await FetchApiDelete(`/init/progress-vendors/${progressId}`, undefined, vendorIds);
	
	console.log('=== ProgressVendor 삭제 API 응답 ===');
	console.log('Response:', res);
	
	if (res.status !== 'success') {
		throw new Error(res.errorMessage || 'ProgressVendor 연결 삭제 실패');
	}
	return res.data;
}; 