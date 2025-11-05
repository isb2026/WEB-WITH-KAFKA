import {
	FetchApiPost,
	FetchApiGet,
	FetchApiPut,
	FetchApiDelete,
	getSearchParams,
} from '@primes/utils/request';
import {
	OrderMasterListResponse,
	CreateOrderMasterPayload,
	UpdateOrderMasterPayload,
	GetAllOrderMasterListPayload,
	GetSearchOrderMasterListPayload,
	SearchOrderMasterRequest,
} from '@primes/types/sales/orderMaster';
import {
	OrderDetailListResponse,
	CreateOrderDetailPayload,
	OrderDetailItem,
	UpdateOrderDetailPayload,
	GetAllOrderDetailListPayload,
	GetSearchOrderDetailListPayload,
	SearchOrderDetailRequest,
} from '@primes/types/sales/orderDetail';

// 🚨 Swagger API 기반 cleanedParams 패턴
// Sales API - order 모듈 실제 필드 적용

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
 * 주문 마스터 목록 조회 (Swagger 기반 cleanedParams 패턴)
 */
export const getOrderMasterList = async (
	params: GetSearchOrderMasterListPayload = { page: 0, size: 10, searchRequest: {} }
)=> {
	const { page = 0, size = 10, searchRequest = {} } = params;
	if (searchRequest.id === 0) {
		return {
			content: [],
			totalElements: 0,
			totalPages: 0,
			size,
			number: page,
			numberOfElements: 0,
			first: page === 0,
			last: true,
			empty: true,
		};
	}
	const searchParams = getSearchParams(searchRequest);
	const url = `/sales/order/master?page=${page}&size=${size}&${searchParams}`;

	const res = await FetchApiGet(url);

	if (res.status !== 'success') {
		throw new Error(res.errorMessage || '주문 마스터 목록 조회 실패');
	}

	// meta 데이터를 JSON으로 변환
	if (res.data?.content) {
		res.data.content = res.data.content.map((item: any) => ({
			...item,
			meta: item.meta ? JSON.parse(item.meta) : null
		}));
	}

	return res.data;
};

/**
 * 주문 마스터 상세 포함 목록 조회 (Swagger 기반 cleanedParams 패턴)
 */
export const getOrderMasterListWithDetails = async (
	params: GetAllOrderMasterListPayload = { page: 0, size: 10 }
): Promise<OrderMasterListResponse> => {
	const { page = 0, size = 10 } = params;
	
	const res = await FetchApiGet(
		`/sales/order/master/with-details?page=${page}&size=${size}`
	);
	
	if (res.status !== 'success') {
		throw new Error(res.errorMessage || '주문 마스터 상세 포함 목록 조회 실패');
	}
	
	return res.data;
};

/**
 * 주문 마스터 단일 조회 (Swagger 기반 cleanedParams 패턴)
 */
export const getOrderMasterById = async (params: {
	id: number;
	page: number;
	size: number;
}) => {
	const { id, page = 0, size = 10 } = params;
	
	const res = await FetchApiGet(`/sales/order/master/${id}?page=${page}&size=${size}`);
	
	if (res.status !== 'success') {
		throw new Error(res.errorMessage || '주문 마스터 조회 실패');
	}
	
	return res.data;
};

/**
 * 주문 마스터 생성 (Swagger 기반 cleanedParams 패턴)
 */
export const createOrderMaster = async (data: CreateOrderMasterPayload) => {
	// Swagger API 검증된 허용 키만 추출
	const {
		orderCode,
		orderType,
		vendorNo,
		vendorName,
		orderDate,
		deliveryLocationCode,
		deliveryLocation,
		requestDate,
		currencyUnit,
		isUse,
	} = data;

	const cleanedParams: any = {
		vendorNo,
		vendorName,
		orderDate,
	};

	// 선택적 필드들 추가
	if (orderCode !== undefined && orderCode !== null && orderCode !== '') {
		cleanedParams.orderCode = orderCode;
	}
	if (orderType !== undefined && orderType !== null && orderType !== '') {
		cleanedParams.orderType = orderType;
	}
	if (deliveryLocationCode !== undefined && deliveryLocationCode !== null) {
		cleanedParams.deliveryLocationCode = deliveryLocationCode;
	}
	if (deliveryLocation !== undefined && deliveryLocation !== null && deliveryLocation !== '') {
		cleanedParams.deliveryLocation = deliveryLocation;
	}
	if (requestDate !== undefined && requestDate !== null && requestDate !== '') {
		cleanedParams.requestDate = requestDate;
	}
	if (currencyUnit !== undefined && currencyUnit !== null && currencyUnit !== '') {
		cleanedParams.currencyUnit = currencyUnit;
	}
	// if (isUse !== undefined && isUse !== null) {
	// 	cleanedParams.isUse = isUse;
	// }

	const res = await FetchApiPost('/sales/order/master', cleanedParams);
	
	if (res.status !== 'success') {
		throw new Error(res.errorMessage || '주문 마스터 생성 실패');
	}
	
	return res.data;
};

/**
 * 주문 마스터 수정 (Swagger 기반 cleanedParams 패턴)
 */
export const updateOrderMaster = async (
	id: number,
	data: UpdateOrderMasterPayload
) => {
	// Swagger API 검증된 허용 키만 추출
	const {
		orderType,
		vendorNo,
		vendorName,
		orderDate,
		deliveryLocationCode,
		deliveryLocation,
		requestDate,
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
		orderDate,
		isUse,
	};

	// 선택적 필드들 추가
	if (orderType !== undefined && orderType !== null && orderType !== '') {
		cleanedParams.orderType = orderType;
	}
	if (deliveryLocationCode !== undefined && deliveryLocationCode !== null) {
		cleanedParams.deliveryLocationCode = deliveryLocationCode;
	}
	if (deliveryLocation !== undefined && deliveryLocation !== null && deliveryLocation !== '') {
		cleanedParams.deliveryLocation = deliveryLocation;
	}
	if (requestDate !== undefined && requestDate !== null && requestDate !== '') {
		cleanedParams.requestDate = requestDate;
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

	const res = await FetchApiPut(`/sales/order/master/${id}`, cleanedParams);
	
	if (res.status !== 'success') {
		throw new Error(res.errorMessage || '주문 마스터 수정 실패');
	}
	
	return res.data;
};

/**
 * 주문 마스터 삭제
 */
export const deleteOrderMaster = async (ids: number[]) => {
	const res = await FetchApiDelete(`/sales/order/master`, undefined, ids);
	
	if (res.status !== 'success') {
		throw new Error(res.errorMessage || '주문 마스터 삭제 실패');
	}
	
	return res.data;
};

/**
 * 주문 마스터 검색 (Swagger 기반 cleanedParams 패턴)
 */
export const getSearchOrderMasterList = async (
	payload: GetSearchOrderMasterListPayload
): Promise<OrderMasterListResponse> => {
	const res = await FetchApiGet('/sales/order/master/search', payload);
	
	if (res.status !== 'success') {
		throw new Error(res.errorMessage || '주문 마스터 검색 실패');
	}
	
	return res.data;
};

/**
 * 주문 마스터 Field API (Custom Select용)
 * Swagger에서 Field API 지원 확인됨 ✅
 */
export const getOrderMasterFields = async (params?: any) => {
	const res = await FetchApiGet('/sales/order/master/fields', params);
	
	if (res.status !== 'success') {
		throw new Error(res.errorMessage || '주문 마스터 필드 조회 실패');
	}
	
	return res.data; // [{ id, value }] 형태
};

/**
 * 주문 마스터 Field API by Field Name (Custom Select용)
 */
export const getOrderMasterField = async (fieldName: string) => {
	const res = await FetchApiGet(`/sales/order/master/fields/${fieldName}`);
	
	if (res.status !== 'success') {
		throw new Error(res.errorMessage || '주문 마스터 필드 조회 실패');
	}
	
	return res.data;
};

// Order Detail API calls

/**
 * 주문 상세 목록 조회 by Master ID (Swagger 기반 cleanedParams 패턴)
 */
export const getOrderDetailListById = async (
	orderMasterId: number,
	page: number = 0,
	size: number = 10
): Promise<OrderDetailListResponse> => {
	const res = await FetchApiGet(`/sales/order/detail?orderMasterId=${orderMasterId}&page=${page}&size=${size}`);
	
	if (res.status !== 'success') {
		throw new Error(res.errorMessage || `주문 ID ${orderMasterId}의 상세 목록 조회 실패`);
	}
	
	return res.data;
};

/**
 * 주문 상세 목록 조회 (Swagger 기반 cleanedParams 패턴)
 */
export const getOrderDetailList = async (
	params: GetAllOrderDetailListPayload = { page: 0, size: 10 }
): Promise<OrderDetailListResponse> => {
	const { page = 0, size = 10 } = params;
	
	const res = await FetchApiGet(`/sales/order/detail?page=${page}&size=${size}`);
	
	if (res.status !== 'success') {
		throw new Error(res.errorMessage || '주문 상세 목록 조회 실패');
	}
	
	return res.data;
};

/**
 * 주문 상세 생성 (Swagger 기반 cleanedParams 패턴)
 */
export const createOrderDetail = async (data: Partial<CreateOrderDetailPayload>[]) => {
	// Swagger API 검증된 허용 키만 추출
	const cleanedParamsArray = [];

	for (const item of data) {
		const {
		orderMasterId,
		itemId,
		itemNo,
		itemNumber,
		itemName,
		orderUnit,
		orderNumber,
		currencyUnit,
		unitPrice,
		netPrice,
		vat,
		grossPrice,
		requestDate,
	} = item;

	const cleanedParams: any = {
		orderMasterId,
			itemId,
			itemNo,
			itemNumber,
			itemName,
			orderUnit,
			orderNumber,
			currencyUnit,
			unitPrice,
			netPrice,
			vat,
			grossPrice,
			requestDate,
		};
		cleanedParamsArray.push(cleanedParams);
	}

	const res = await FetchApiPost('/sales/order/detail', cleanedParamsArray);
	
	if (res.status !== 'success') {
		throw new Error(res.errorMessage || '주문 상세 생성 실패');
	}
	
	return res.data;
};

/**
 * 주문 상세 수정 (Swagger 기반 cleanedParams 패턴)
 */
export const updateOrderDetail = async (
	id: number,
	data: OrderDetailItem
) => {
	// Swagger API 검증된 허용 키만 추출
	const {
		orderMasterId,
		itemId,
		itemNo,
		itemNumber,
		itemName,
		orderUnit,
		orderNumber,
		currencyUnit,
		unitPrice,
		netPrice,
		vat,
		grossPrice,
		requestDate,
		isUse,
	} = data;

	const cleanedParams: any = {
		orderMasterId,
		itemId,
		itemNo,
		itemNumber,
		itemName,
		orderUnit,
		orderNumber,
		currencyUnit,
		unitPrice,
		netPrice,
		vat,
		grossPrice,
		requestDate,
	};

	// 선택적 필드들 추가
	if (isUse !== undefined && isUse !== null) {
		cleanedParams.isUse = isUse;
	}

	const res = await FetchApiPut(`/sales/order/detail/${id}`, cleanedParams);
	
	if (res.status !== 'success') {
		throw new Error(res.errorMessage || '주문 상세 수정 실패');
	}
	
	return res.data;
};

/**
 * 주문 상세 삭제
 */
export const deleteOrderDetail = async (ids: number[]) => {
	const res = await FetchApiDelete(`/sales/order/detail`, undefined, ids);
	
	if (res.status !== 'success') {
		throw new Error(res.errorMessage || '주문 상세 삭제 실패');
	}
	
	return res.data;
};

/**
 * 주문 상세 검색 (Swagger 기반 cleanedParams 패턴)
 */
export const getSearchOrderDetailList = async (
	payload: GetSearchOrderDetailListPayload
): Promise<OrderDetailListResponse> => {
	const res = await FetchApiGet('/sales/order/detail/search', payload);
	
	if (res.status !== 'success') {
		throw new Error(res.errorMessage || '주문 상세 검색 실패');
	}
	
	return res.data;
};

/**
 * 주문 상세 Field API (Custom Select용)
 * Swagger에서 Field API 지원 확인됨 ✅
 */
export const getOrderDetailFields = async (params?: any) => {
	const res = await FetchApiGet('/sales/order/detail/fields', params);
	
	if (res.status !== 'success') {
		throw new Error(res.errorMessage || '주문 상세 필드 조회 실패');
	}
	
	return res.data; // [{ id, value }] 형태
};

/**
 * 주문 상세 Field API by Field Name (Custom Select용)
 */
export const getOrderDetailField = async (fieldName: string) => {
	const res = await FetchApiGet(`/sales/order/detail/fields/${fieldName}`);
	
	if (res.status !== 'success') {
		throw new Error(res.errorMessage || '주문 상세 필드 조회 실패');
	}
	
	return res.data;
};
