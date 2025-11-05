import {
	FetchApiPost,
	FetchApiGet,
	FetchApiPut,
	FetchApiDelete,
} from '@primes/utils/request';
import {
	ItemProgressSearchRequest,
	ItemProgressCreateRequest,
	ItemProgressUpdateRequest,
	ItemProgressListCreateRequest,
	ItemProgressUpdateAllRequest,
} from '@primes/types/progress';

// ItemProgress 조회 (GET /item-progress)
export const getItemProgressList = async ({
	searchRequest,
	page = 0,
	size = 10,
}: {
	searchRequest: ItemProgressSearchRequest;
	page?: number;
	size?: number;
}) => {
	// searchRequest 객체를 URL 파라미터로 풀어서 전달
	const params = {
		page,
		size,
		...searchRequest, // searchRequest의 모든 속성을 직접 파라미터로 풀어서 전달
	};

	const res = await FetchApiGet('/init/item-progress', params);
	if (res.status !== 'success') {
		throw new Error(res.errorMessage || 'ItemProgress 목록 조회 실패');
	}
	return res.data;
};

// ItemProgress 생성 (POST /item-progress)
export const createItemProgress = async (
	data: Partial<ItemProgressCreateRequest>
) => {
	// Validate required fields
	if (!data.itemId) {
		throw new Error('itemId is required for progress creation');
	}

	// Extract only allowed keys based on Swagger
	const {
		accountYear,
		itemId,
		progressOrder,
		progressName,
		isOutsourcing,
		progressTypeCode,
		progressTypeName,
		progressRealName,
		defaultCycleTime,
		optimalProgressInventoryQty,
		safetyProgressInventoryQty,
		progressDefaultSpec,
		keyManagementContents,
		// 단위 관련 필드들 추가
		unitWeight,
		unitTypeName,
		unitTypeCode,
	} = data;

	const cleanedParams: ItemProgressCreateRequest = {
		accountYear: accountYear || new Date().getFullYear(), // Default to current year
		itemId,
		progressOrder,
		progressName: progressName || '', // progressName is required
		isOutsourcing: isOutsourcing || false, // Default to false
		progressTypeCode,
		progressTypeName,
		progressRealName,
		defaultCycleTime,
		optimalProgressInventoryQty,
		safetyProgressInventoryQty,
		progressDefaultSpec,
		keyManagementContents,
		// 단위 관련 필드들 추가
		unitWeight,
		unitTypeName,
		unitTypeCode,
	};

	const requestBody = [cleanedParams];

	const res = await FetchApiPost('/init/item-progress', requestBody);
	if (res.status !== 'success') {
		throw new Error(res.errorMessage || 'ItemProgress 생성 실패');
	}
	return res.data;
};

// ItemProgress 일괄 수정 (PUT /item-progress)
export const updateItemProgressBulk = async (
	itemProgresses: ItemProgressUpdateAllRequest[]
) => {
	const res = await FetchApiPut('/init/item-progress', itemProgresses);
	if (res.status !== 'success') {
		throw new Error(res.errorMessage || 'ItemProgress 일괄 수정 실패');
	}
	return res.data;
};

// ItemProgress 수정 (PUT /item-progress/{id})
export const updateItemProgress = async (
	id: number,
	data: Partial<ItemProgressUpdateRequest>
) => {
	const {
		isUse,
		accountYear,
		itemId,
		progressOrder,
		progressName,
		isOutsourcing,
		progressTypeCode,
		progressTypeName,
		defaultCycleTime,
		optimalProgressInventoryQty,
		safetyProgressInventoryQty,
		progressDefaultSpec,
		keyManagementContents,
	} = data;

	const cleanedParams = {
		isUse,
		accountYear,
		itemId,
		progressOrder,
		progressName,
		isOutsourcing,
		progressTypeCode,
		progressTypeName,
		defaultCycleTime,
		optimalProgressInventoryQty,
		safetyProgressInventoryQty,
		progressDefaultSpec,
		keyManagementContents,
	};

	const res = await FetchApiPut(`/init/item-progress/${id}`, cleanedParams);
	if (res.status !== 'success') {
		throw new Error(res.errorMessage || 'ItemProgress 수정 실패');
	}
	return res.data;
};

// ItemProgress 삭제 (DELETE /item-progress)
export const deleteItemProgress = async (ids: number[]) => {
	const res = await FetchApiDelete('/init/item-progress', undefined, ids);
	if (res.status !== 'success') {
		throw new Error(res.errorMessage || 'ItemProgress 삭제 실패');
	}
	return res.data;
};

// ItemProgress 특정 필드 값 전체 조회 (GET /item-progress/fields/{fieldName})
export const getItemProgressFieldValues = async (
	fieldName: string,
	searchRequest: ItemProgressSearchRequest = {}
) => {
	// searchRequest 객체를 개별 파라미터로 풀어서 전달
	const params: any = {};

	// searchRequest의 각 필드를 개별 파라미터로 추가
	if (searchRequest.isUse !== undefined) params.isUse = searchRequest.isUse;
	if (searchRequest.createdAtStart)
		params.createdAtStart = searchRequest.createdAtStart;
	if (searchRequest.createdAtEnd)
		params.createdAtEnd = searchRequest.createdAtEnd;
	if (searchRequest.createdBy) params.createdBy = searchRequest.createdBy;
	if (searchRequest.updatedAtStart)
		params.updatedAtStart = searchRequest.updatedAtStart;
	if (searchRequest.updatedAtEnd)
		params.updatedAtEnd = searchRequest.updatedAtEnd;
	if (searchRequest.updatedBy) params.updatedBy = searchRequest.updatedBy;
	if (searchRequest.id) params.id = searchRequest.id;
	if (searchRequest.accountYear)
		params.accountYear = searchRequest.accountYear;
	if (searchRequest.itemId) params.itemId = searchRequest.itemId;
	if (searchRequest.progressOrder)
		params.progressOrder = searchRequest.progressOrder;
	if (searchRequest.progressName)
		params.progressName = searchRequest.progressName;
	if (searchRequest.isOutsourcing !== undefined)
		params.isOutsourcing = searchRequest.isOutsourcing;
	// 새로운 필드들 추가
	if (searchRequest.progressTypeCode)
		params.progressTypeCode = searchRequest.progressTypeCode;
	if (searchRequest.progressTypeName)
		params.progressTypeName = searchRequest.progressTypeName;
	if (searchRequest.progressRealName)
		params.progressRealName = searchRequest.progressRealName;
	if (searchRequest.defaultCycleTime)
		params.defaultCycleTime = searchRequest.defaultCycleTime;
	if (searchRequest.optimalProgressInventoryQty)
		params.optimalProgressInventoryQty =
			searchRequest.optimalProgressInventoryQty;
	if (searchRequest.safetyProgressInventoryQty)
		params.safetyProgressInventoryQty =
			searchRequest.safetyProgressInventoryQty;
	if (searchRequest.progressDefaultSpec)
		params.progressDefaultSpec = searchRequest.progressDefaultSpec;
	if (searchRequest.keyManagementContents)
		params.keyManagementContents = searchRequest.keyManagementContents;

	const res = await FetchApiGet(
		`/init/item-progress/fields/${fieldName}`,
		params
	);
	if (res.status !== 'success') {
		throw new Error(res.errorMessage || 'ItemProgress 필드 조회 실패');
	}
	return res.data;
};

// Legacy function names for backward compatibility
export const getAllProgressList = getItemProgressList;
export const createProgress = createItemProgress;
export const updateProgress = updateItemProgress;
export const deleteProgress = deleteItemProgress;

// getProgressFieldName을 별도로 정의해서 itemId 파라미터 지원
export const getProgressFieldName = async (
	fieldName: string,
	itemId?: number | string
) => {
	const searchRequest: ItemProgressSearchRequest = {};

	// itemId가 있으면 검색 조건에 추가
	if (itemId) {
		searchRequest.itemId = Number(itemId);
	}

	return getItemProgressFieldValues(fieldName, searchRequest);
};
