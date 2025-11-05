import {
	FetchApiPost,
	FetchApiGet,
	FetchApiPut,
	FetchApiDelete,
	getSearchParams,
} from '@primes/utils/request';
import {
	DeliveryMasterListResponse,
	CreateDeliveryMasterPayload,
	UpdateDeliveryMasterPayload,
	GetAllDeliveryMasterListPayload,
	SearchDeliveryMasterRequest,
	GetSearchDeliveryMasterListPayload,
} from '@primes/types/sales/deliveryMaster';
import {
	DeliveryDetailListResponse,
	CreateDeliveryDetailPayload,
	DeliveryDetailItem,
	UpdateDeliveryDetailPayload,
	GetAllDeliveryDetailListPayload,
	SearchDeliveryDetailRequest,
} from '@primes/types/sales/deliveryDetail';

// 🚨 Swagger API 기반 cleanedParams 패턴
// Sales API - delivery 모듈 실제 필드 적용

const cleanParam = (params: Record<string, any>): Record<string, any> => {
	const cleaned: Record<string, any> = {};
	for (const [key, value] of Object.entries(params)) {
		if (value !== undefined && value !== null && value !== '') {
			cleaned[key] = value;
		}
	}
	return cleaned;
};

/**
 * 납품 마스터 목록 조회 (Swagger 기반 cleanedParams 패턴)
 */
export const getDeliveryMasterList = async (
	params: GetSearchDeliveryMasterListPayload = { page: 0, size: 10, searchRequest: {}}
) => {
	const { page = 0, size = 10, searchRequest = {} } = params;
	if (searchRequest.id === 0) {
		return {
			content: [],
			totalElements: 0,
			totalPages: 0,
			size,
			number: page,
			sort: { empty: true, sorted: false, unsorted: true },
			numberOfElements: 0,
			pageable: {
				offset: 0,
				sort: { empty: true, sorted: false, unsorted: true },
				pageNumber: page,
				pageSize: size,
				paged: true,
				unpaged: false
			},
			first: page === 0,
			last: true,
			empty: true,
		};
	}
	
	const searchParams = getSearchParams(searchRequest);
	const url = `/sales/delivery/master?page=${page}&size=${size}&${searchParams}`;

	const res = await FetchApiGet(url);
	
	if (res.status !== 'success') {
		throw new Error(res.errorMessage || '납품 마스터 목록 조회 실패');
	}
	
	return res.data;
};

/**
 * 납품 마스터 단일 조회 (Swagger 기반 cleanedParams 패턴)
 */
export const getDeliveryMasterById = async (params: {
	id: number;
	page: number;
	size: number;
}) => {
	const { id, page = 0, size = 10 } = params;
	
	const res = await FetchApiGet(`/sales/delivery/master/${id}?page=${page}&size=${size}`);
	
	if (res.status !== 'success') {
		throw new Error(res.errorMessage || '납품 마스터 조회 실패');
	}
	
	return res.data;
};

/**
 * 납품 마스터 생성 (Swagger 기반 cleanedParams 패턴)
 */
export const createDeliveryMaster = async (data: CreateDeliveryMasterPayload) => {
	// Swagger API 검증된 허용 키만 추출
	const {
		deliveryCode,
		vendorNo,
		vendorName,
		deliveryDate,
		deliveryLocationCode,
		deliveryLocation,
		currencyUnit,
		isUse,
	} = data;

	const cleanedParams: any = {
		vendorNo,
		vendorName,
		deliveryDate,
	};

	// 선택적 필드들 추가
	if (deliveryCode !== undefined && deliveryCode !== null && deliveryCode !== '') {
		cleanedParams.deliveryCode = deliveryCode;
	}
	if (deliveryLocationCode !== undefined && deliveryLocationCode !== null) {
		cleanedParams.deliveryLocationCode = deliveryLocationCode;
	}
	if (deliveryLocation !== undefined && deliveryLocation !== null && deliveryLocation !== '') {
		cleanedParams.deliveryLocation = deliveryLocation;
	}
	if (currencyUnit !== undefined && currencyUnit !== null && currencyUnit !== '') {
		cleanedParams.currencyUnit = currencyUnit;
	}
	if (isUse !== undefined && isUse !== null) {
		cleanedParams.isUse = isUse;
	}

	const res = await FetchApiPost('/sales/delivery/master', cleanedParams);
	
	if (res.status !== 'success') {
		throw new Error(res.errorMessage || '납품 마스터 생성 실패');
	}
	
	return res.data;
};

/**
 * 납품 마스터 수정 (Swagger 기반 cleanedParams 패턴)
 */
export const updateDeliveryMaster = async (
	id: number,
	data: UpdateDeliveryMasterPayload
) => {
	// Swagger API 검증된 허용 키만 추출
	const {
		deliveryCode,
		vendorNo,
		vendorName,
		deliveryDate,
		deliveryLocationCode,
		deliveryLocation,
		currencyUnit,
		isApproval,
		approvalBy,
		approvalAt,
		isClose,
		closeBy,
		closeAt,
		isUse,
	} = data;

	const cleanedParams: any = {
		vendorNo,
		vendorName,
		deliveryDate,
		isUse,
	};

	// 선택적 필드들 추가
	if (deliveryCode !== undefined && deliveryCode !== null && deliveryCode !== '') {
		cleanedParams.deliveryCode = deliveryCode;
	}
	if (deliveryLocationCode !== undefined && deliveryLocationCode !== null) {
		cleanedParams.deliveryLocationCode = deliveryLocationCode;
	}
	if (deliveryLocation !== undefined && deliveryLocation !== null && deliveryLocation !== '') {
		cleanedParams.deliveryLocation = deliveryLocation;
	}
	if (currencyUnit !== undefined && currencyUnit !== null && currencyUnit !== '') {
		cleanedParams.currencyUnit = currencyUnit;
	}
	if (isApproval !== undefined && isApproval !== null) {
		cleanedParams.isApproval = isApproval;
	}
	if (approvalBy !== undefined && approvalBy !== null && approvalBy !== '') {
		cleanedParams.approvalBy = approvalBy;
	}
	if (approvalAt !== undefined && approvalAt !== null && approvalAt !== '') {
		cleanedParams.approvalAt = approvalAt;
	}
	if (isClose !== undefined && isClose !== null) {
		cleanedParams.isClose = isClose;
	}
	if (closeBy !== undefined && closeBy !== null && closeBy !== '') {
		cleanedParams.closeBy = closeBy;
	}
	if (closeAt !== undefined && closeAt !== null && closeAt !== '') {
		cleanedParams.closeAt = closeAt;
	}

	const res = await FetchApiPut(`/sales/delivery/master/${id}`, cleanedParams);
	
	if (res.status !== 'success') {
		throw new Error(res.errorMessage || '납품 마스터 수정 실패');
	}
	
	return res.data;
};

/**
 * 납품 마스터 삭제
 */
export const deleteDeliveryMaster = async (ids: number[]) => {
	const res = await FetchApiDelete(`/sales/delivery/master`, undefined, ids);
	
	if (res.status !== 'success') {
		throw new Error(res.errorMessage || '납품 마스터 삭제 실패');
	}
	
	return res.data;
};

// Delivery Detail API calls

/**
 * 납품 상세 목록 조회 by Master ID (Swagger 기반 cleanedParams 패턴)
 */
export const getDeliveryDetailListById = async (
	deliveryMasterId: number,
	page: number = 0,
	size: number = 10
): Promise<DeliveryDetailListResponse> => {
	const res = await FetchApiGet(`/sales/delivery/detail?deliveryMasterId=${deliveryMasterId}&page=${page}&size=${size}`);
	
	if (res.status !== 'success') {
		throw new Error(res.errorMessage || `납품 ID ${deliveryMasterId}의 상세 목록 조회 실패`);
	}
	
	return res.data;
};

/**
 * 납품 상세 목록 조회 (Swagger 기반 cleanedParams 패턴)
 */
export const getDeliveryDetailList = async (
	params: GetAllDeliveryDetailListPayload = { page: 0, size: 10 }
): Promise<DeliveryDetailListResponse> => {
	const { page = 0, size = 10 } = params;
	
	const res = await FetchApiGet(`/sales/delivery/detail?page=${page}&size=${size}`);
	
	if (res.status !== 'success') {
		throw new Error(res.errorMessage || '납품 상세 목록 조회 실패');
	}
	
	return res.data;
};

/**
 * 납품 상세 생성 (Swagger 기반 cleanedParams 패턴)
 */
export const createDeliveryDetail = async (data: CreateDeliveryDetailPayload[]) => {
	// Handle array of items - collect all cleanedParams first
	const cleanedParamsArray = [];

	for (const item of data) {
		// Swagger API 검증된 허용 키만 추출
		const {
			deliveryMasterId,
			itemId,
			itemNo,
			itemNumber,
			itemName,
			itemSpec,
			deliveryUnit,
			deliveryAmount,
			currencyUnit,
			unitPrice,
			netPrice,
			vat,
			grossPrice,
			memo,
		} = item;

		const cleanedParams: any = {
			deliveryMasterId,
			itemId,
			itemNo,
			itemNumber,
			itemName,
			itemSpec,
			deliveryUnit,
			deliveryAmount,
			currencyUnit,
			unitPrice,
			netPrice,
			vat,
			grossPrice,
		};

		// 선택적 필드들 추가
		if (memo !== undefined && memo !== null && memo !== '') {
			cleanedParams.memo = memo;
		}

		cleanedParamsArray.push(cleanedParams);
	}

	// API를 한 번만 호출하여 모든 데이터를 전송
	const res = await FetchApiPost('/sales/delivery/detail', cleanedParamsArray);
	
	if (res.status !== 'success') {
		throw new Error(res.errorMessage || '납품 상세 생성 실패');
	}
	
	return res.data;
};

/**
 * 납품 상세 수정 (Swagger 기반 cleanedParams 패턴)
 */
export const updateDeliveryDetail = async (id: number, data: DeliveryDetailItem[]) => {
	// Handle array of items - collect all cleanedParams first
	const cleanedParamsArray = [];

	for (const item of data) {
		// Swagger API 검증된 허용 키만 추출
		const {
			deliveryMasterId,
			itemId,
			itemNo,
			itemNumber,
			itemName,
			itemSpec,
			deliveryUnit,
			deliveryAmount,
			currencyUnit,
			unitPrice,
			netPrice,
			vat,
			grossPrice,
			memo,
			isUse,
		} = item;

		const cleanedParams: any = {
			deliveryMasterId,
			itemId,
			itemNo,
			itemNumber,
			itemName,
			itemSpec,
			deliveryUnit,
			deliveryAmount,
			currencyUnit,
			unitPrice,
			netPrice,
			vat,
			grossPrice,
		};

		// 선택적 필드들 추가
		if (memo !== undefined && memo !== null && memo !== '') {
			cleanedParams.memo = memo;
		}
		if (isUse !== undefined && isUse !== null) {
			cleanedParams.isUse = isUse;
		}

		cleanedParamsArray.push(cleanedParams);
	}

	const res = await FetchApiPut(`/sales/delivery/detail`, cleanedParamsArray);
	
	if (res.status !== 'success') {
		throw new Error(res.errorMessage || '납품 상세 수정 실패');
	}
	
	return res.data;
};

/**
 * 납품 상세 삭제
 */
export const deleteDeliveryDetail = async (ids: number[]) => {
	const res = await FetchApiDelete(`/sales/delivery/detail`, undefined, ids);
	
	if (res.status !== 'success') {
		throw new Error(res.errorMessage || '납품 상세 삭제 실패');
	}
	
	return res.data;
};

/**
 * 납품 마스터 Field API (Custom Select용)
 * Swagger에서 Field API 지원 확인됨 ✅
 */
export const getDeliveryMasterFields = async (params?: any) => {
	const res = await FetchApiGet('/sales/delivery/master/fields', params);
	
	if (res.status !== 'success') {
		throw new Error(res.errorMessage || '납품 마스터 필드 조회 실패');
	}
	
	return res.data; // [{ id, value }] 형태
};

/**
 * 납품 마스터 Field API by Field Name (Custom Select용)
 */
export const getDeliveryMasterByField = async (fieldName: string) => {
	const res = await FetchApiGet(`/sales/delivery/master/fields/${fieldName}`);
	
	if (res.status !== 'success') {
		throw new Error(res.errorMessage || '납품 마스터 필드 조회 실패');
	}
	
	return res.data;
};

/**
 * 납품 상세 Field API (Custom Select용)
 * Swagger에서 Field API 지원 확인됨 ✅
 */
export const getDeliveryDetailFields = async (params?: any) => {
	const res = await FetchApiGet('/sales/delivery/detail/fields', params);
	
	if (res.status !== 'success') {
		throw new Error(res.errorMessage || '납품 상세 필드 조회 실패');
	}
	
	return res.data; // [{ id, value }] 형태
};

/**
 * 납품 상세 Field API by Field Name (Custom Select용)
 */
export const getDeliveryDetailByField = async (fieldName: string) => {
	const res = await FetchApiGet(`/sales/delivery/detail/fields/${fieldName}`);
	
	if (res.status !== 'success') {
		throw new Error(res.errorMessage || '납품 상세 필드 조회 실패');
	}
	
	return res.data;
};
