import {
	FetchApiPost,
	FetchApiGet,
	FetchApiPut,
	FetchApiDelete,
} from '@primes/utils/request';

// ItemProgress Master API calls
export const getItemProgressList = async (
	searchRequest: any = {},
	page: number = 0,
	size: number = 10
) => {
	const res = await FetchApiGet('/ini/item-progress', {
		searchRequest,
		page,
		size,
	});
	if (res.status !== 'success') {
		throw new Error('ItemProgress 목록 조회 실패');
	}
	return res.data;
};

export const createItemProgress = async (data: any) => {
	// cleanedParams 패턴 적용 - API 스키마에 맞춰 허용된 필드만 추출
	const {
		accountYear,
		itemId,
		progressOrder,
		progressName,
		isOutsourcing,
		// 새로운 필드들 추가
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

	const cleanedParams = {
		accountYear,
		itemId,
		progressOrder,
		progressName,
		isOutsourcing,
		// 새로운 필드들 추가
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

	const res = await FetchApiPost('/ini/item-progress', cleanedParams);
	if (res.status !== 'success') {
		throw new Error('ItemProgress 생성 실패');
	}
	return res.data;
};

export const updateItemProgress = async (id: number, data: any) => {
	// cleanedParams 패턴 적용 - API 스키마에 맞춰 허용된 필드만 추출
	const {
		isUse,
		accountYear,
		itemId,
		progressOrder,
		progressName,
		isOutsourcing,
		// 새로운 필드들 추가
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

	const cleanedParams = {
		isUse,
		accountYear,
		itemId,
		progressOrder,
		progressName,
		isOutsourcing,
		// 새로운 필드들 추가
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

	const res = await FetchApiPut(`/ini/item-progress/${id}`, cleanedParams);
	if (res.status !== 'success') {
		throw new Error('ItemProgress 수정 실패');
	}
	return res.data;
};

export const deleteItemProgress = async (ids: number[]) => {
	const res = await FetchApiDelete('/ini/item-progress', ids);
	if (res.status !== 'success') {
		throw new Error('ItemProgress 삭제 실패');
	}
	return res.data;
};

// ItemProgress 특정 필드 값 전체 조회 (GET /item-progress/fields/{fieldName})
export const getItemProgressFieldName = async (fieldName: string) => {
	const res = await FetchApiGet(`/ini/item-progress/fields/${fieldName}`);
	if (res.status !== 'success') {
		throw new Error('ItemProgress 필드 조회 실패');
	}
	return res.data;
};
