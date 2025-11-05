import {
	FetchApiPost,
	FetchApiGet,
	FetchApiPut,
	FetchApiDelete,
} from '@primes/utils/request';

// ProgressRoute types (inline for now)
interface ProgressRouteSearchRequest {
	isUse?: boolean;
	createdAtStart?: string;
	createdAtEnd?: string;
	createdBy?: string;
	updatedAtStart?: string;
	updatedAtEnd?: string;
	updatedBy?: string;
	id?: number;
	itemId?: number;
	progressSequence?: number;
	progressTypeCode?: string;
	progressTypeName?: string;
	progressRealName?: string;
	defaultCycleTime?: number;
	lotSize?: number;
	lotUnit?: string;
	optimalProgressInventoryQty?: number;
	safetyProgressInventoryQty?: number;
	progressDefaultSpec?: string;
	keyManagementContents?: string;
}

interface ProgressRouteCreateRequest {
	itemId?: number;
	progressSequence?: number;
	progressTypeCode?: string;
	progressTypeName?: string;
	progressRealName?: string;
	defaultCycleTime?: number;
	lotSize?: number;
	lotUnit?: string;
	optimalProgressInventoryQty?: number;
	safetyProgressInventoryQty?: number;
	progressDefaultSpec?: string;
	keyManagementContents?: string;
}

interface ProgressRouteListCreateRequest {
	dataList: ProgressRouteCreateRequest[];
}

interface ProgressRouteUpdateRequest {
	isUse?: boolean;
	itemId?: number;
	progressSequence?: number;
	progressTypeCode?: string;
	progressTypeName?: string;
	progressRealName?: string;
	defaultCycleTime?: number;
	lotSize?: number;
	lotUnit?: string;
	optimalProgressInventoryQty?: number;
	safetyProgressInventoryQty?: number;
	progressDefaultSpec?: string;
	keyManagementContents?: string;
}

interface ProgressRouteUpdateAllRequest {
	id: number;
	isUse?: boolean;
	itemId?: number;
	progressSequence?: number;
	progressTypeCode?: string;
	progressTypeName?: string;
	progressRealName?: string;
	defaultCycleTime?: number;
	lotSize?: number;
	lotUnit?: string;
	optimalProgressInventoryQty?: number;
	safetyProgressInventoryQty?: number;
	progressDefaultSpec?: string;
	keyManagementContents?: string;
}

// ProgressRoute 조회 (GET /progress-route)
export const getProgressRouteList = async ({
	searchRequest,
	page = 0,
	size = 10,
}: {
	searchRequest: ProgressRouteSearchRequest;
	page?: number;
	size?: number;
}) => {
	const res = await FetchApiGet('/init/progress-route', {
		searchRequest,
		page,
		size,
	});
	if (res.status !== 'success') {
		throw new Error(res.errorMessage || 'ProgressRoute 목록 조회 실패');
	}
	return res.data;
};

// ProgressRoute 생성 (POST /progress-route)
export const createProgressRoute = async (
	data: Partial<ProgressRouteCreateRequest>
) => {
	// Extract only allowed keys based on Swagger
	const {
		itemId,
		progressSequence,
		progressTypeCode,
		progressTypeName,
		progressRealName,
		defaultCycleTime,
		lotSize,
		lotUnit,
		optimalProgressInventoryQty,
		safetyProgressInventoryQty,
		progressDefaultSpec,
		keyManagementContents,
	} = data;

	const cleanedParams = {
		itemId,
		progressSequence,
		progressTypeCode,
		progressTypeName,
		progressRealName,
		defaultCycleTime,
		lotSize,
		lotUnit,
		optimalProgressInventoryQty,
		safetyProgressInventoryQty,
		progressDefaultSpec,
		keyManagementContents,
	};

	const requestBody: ProgressRouteListCreateRequest = {
		dataList: [cleanedParams],
	};

	const res = await FetchApiPost('/init/progress-route', requestBody);
	if (res.status !== 'success') {
		throw new Error(res.errorMessage || 'ProgressRoute 생성 실패');
	}
	return res.data;
};

// ProgressRoute 일괄 수정 (PUT /progress-route)
export const updateProgressRouteBulk = async (
	progressRoutes: ProgressRouteUpdateAllRequest[]
) => {
	const res = await FetchApiPut('/init/progress-route', progressRoutes);
	if (res.status !== 'success') {
		throw new Error(res.errorMessage || 'ProgressRoute 일괄 수정 실패');
	}
	return res.data;
};

// ProgressRoute 수정 (PUT /progress-route/{id})
export const updateProgressRoute = async (
	id: number,
	data: Partial<ProgressRouteUpdateRequest>
) => {
	const {
		isUse,
		itemId,
		progressSequence,
		progressTypeCode,
		progressTypeName,
		progressRealName,
		defaultCycleTime,
		lotSize,
		lotUnit,
		optimalProgressInventoryQty,
		safetyProgressInventoryQty,
		progressDefaultSpec,
		keyManagementContents,
	} = data;

	const cleanedParams = {
		isUse,
		itemId,
		progressSequence,
		progressTypeCode,
		progressTypeName,
		progressRealName,
		defaultCycleTime,
		lotSize,
		lotUnit,
		optimalProgressInventoryQty,
		safetyProgressInventoryQty,
		progressDefaultSpec,
		keyManagementContents,
	};

	const res = await FetchApiPut(`/init/progress-route/${id}`, cleanedParams);
	if (res.status !== 'success') {
		throw new Error(res.errorMessage || 'ProgressRoute 수정 실패');
	}
	return res.data;
};

// ProgressRoute 삭제 (DELETE /progress-route)
export const deleteProgressRoute = async (ids: number[]) => {
	const res = await FetchApiDelete('/init/progress-route', undefined, ids);
	if (res.status !== 'success') {
		throw new Error(res.errorMessage || 'ProgressRoute 삭제 실패');
	}
	return res.data;
};

// ProgressRoute 특정 필드 값 전체 조회 (GET /progress-route/fields/{fieldName})
export const getProgressRouteFieldValues = async (
	fieldName: string,
	searchRequest: ProgressRouteSearchRequest = {}
) => {
	const res = await FetchApiGet(`/init/progress-route/fields/${fieldName}`, {
		searchRequest,
	});
	if (res.status !== 'success') {
		throw new Error(res.errorMessage || 'ProgressRoute 필드 조회 실패');
	}
	return res.data;
};
