import {
	FetchApiPost,
	FetchApiGet,
	FetchApiPut,
	FetchApiDelete,
	getSearchParams,
} from '@primes/utils/request';
import {
	LotMaster,
	CreateLotPayload,
	UpdateLotPayload,
	UpdateLotAllPayload,
	LotListParams,
	LotSearchRequest,
} from '@primes/types/production';

// Lot API calls
export const getLotList = async (
	searchRequest: any = {},
	page: number = 0,
	size: number = 10
) => {
	// searchRequest에서 허용된 필드만 추출
	const { lotNo, itemNumber, itemName, commandId } = searchRequest;
	const cleanedSearchRequest = { lotNo, itemNumber, itemName, commandId };

	//searchRequest의 lotNo가 0이면 빈 배열 반환
	if (lotNo == 0 || lotNo == '0') {
		return {
			content: [],
			totalElements: 0,
			totalPages: 0,
		};
	}

	//commandId가 0이면 빈 배열 반환
	if (commandId == 0 || commandId == '0') {
		return {
			content: [],
			totalElements: 0,
			totalPages: 0,
		};
	}

	// getSearchParams 유틸리티 사용
	const searchParams = getSearchParams(cleanedSearchRequest || {});
	const url = `/production/lot/master?page=${page}&size=${size}&${searchParams}`;

	const res = await FetchApiGet(url);
	if (res.status !== 'success') {
		const errorMessage = res.errorMessage || 'LOT 목록 조회 실패';
		throw new Error(errorMessage);
	}
	return res.data;
};

export const createLot = async (data: Partial<CreateLotPayload>) => {
	// 허용된 필드만 추출 (cleanedParams 패턴)
	const {
		commandId,
		itemId,
		itemNo,
		itemNumber,
		itemName,
		itemSpec,
		lotAmount,
		lotWeight,
		restAmount,
		restWeight,
		lotUnit,
	} = data;

	const cleanedParams = {
		commandId,
		itemId,
		itemNo,
		itemNumber,
		itemName,
		itemSpec,
		lotAmount,
		lotWeight,
		restAmount,
		restWeight,
		lotUnit,
	};

	const res = await FetchApiPost('/production/lot/master', cleanedParams);
	if (res.status !== 'success') {
		const errorMessage = res.errorMessage || 'LOT 생성 실패';
		throw new Error(errorMessage);
	}
	return res.data;
};

export const updateLot = async (
	id: number,
	data: Partial<UpdateLotPayload>
) => {
	// 허용된 필드만 추출 (cleanedParams 패턴)
	const {
		commandId,
		itemId,
		itemNo,
		itemNumber,
		itemName,
		itemSpec,
		lotAmount,
		lotWeight,
		restAmount,
		restWeight,
		lotUnit,
	} = data;

	const cleanedParams = {
		commandId,
		itemId,
		itemNo,
		itemNumber,
		itemName,
		itemSpec,
		lotAmount,
		lotWeight,
		restAmount,
		restWeight,
		lotUnit,
	};

	const res = await FetchApiPut(
		`/production/lot/master/${id}`,
		cleanedParams
	);
	if (res.status !== 'success') {
		const errorMessage = res.errorMessage || 'LOT 수정 실패';
		throw new Error(errorMessage);
	}
	return res.data;
};

// Lot 일괄 수정
export const updateLotAll = async (data: UpdateLotAllPayload[]) => {
	// cleanedParams 패턴 적용
	const cleanedDataArray = data.map((item) => {
		const {
			id,
			commandId,
			itemId,
			itemNo,
			itemNumber,
			itemName,
			itemSpec,
			lotAmount,
			lotWeight,
			restAmount,
			restWeight,
			lotUnit,
		} = item;

		return {
			id,
			commandId,
			itemId,
			itemNo,
			itemNumber,
			itemName,
			itemSpec,
			lotAmount,
			lotWeight,
			restAmount,
			restWeight,
			lotUnit,
		};
	});

	const res = await FetchApiPut('/production/lot/master', cleanedDataArray);
	if (res.status !== 'success') {
		const errorMessage = res.errorMessage || 'LOT 일괄 수정 실패';
		throw new Error(errorMessage);
	}
	return res.data;
};

export const deleteLot = async (ids: number[]) => {
	const res = await FetchApiDelete('/production/lot/master', ids);
	if (res.status !== 'success') {
		const errorMessage = res.errorMessage || 'LOT 삭제 실패';
		throw new Error(errorMessage);
	}
	return res.data;
};

// 새로운 API: searchMasterWithConditions
export const searchLotMasterWithConditions = async (
	searchRequest: any = {},
	page: number = 0,
	size: number = 10
) => {
	// Swagger API 스펙에 맞는 페이로드 구조 생성
	const payload = {
		conditions: searchRequest.conditions || [],
		createdAtStart: searchRequest.createdAtStart,
		createdAtEnd: searchRequest.createdAtEnd,
		createdBy: searchRequest.createdBy,
		updatedAtStart: searchRequest.updatedAtStart,
		updatedAtEnd: searchRequest.updatedAtEnd,
		updatedBy: searchRequest.updatedBy,
		id: searchRequest.id,
		commandId: searchRequest.commandId,
		itemId: searchRequest.itemId,
		lotNo: searchRequest.lotNo,
		itemNo: searchRequest.itemNo,
		itemNumber: searchRequest.itemNumber,
		itemName: searchRequest.itemName,
		itemSpec: searchRequest.itemSpec,
		lotAmount: searchRequest.lotAmount,
		lotWeight: searchRequest.lotWeight,
		restAmount: searchRequest.restAmount,
		restWeight: searchRequest.restWeight
	};

	// POST 방식으로 페이로드 전송, 페이지네이션은 쿼리 파라미터로
	const url = `/production/lot/master/search?page=${page}&size=${size}`;
	const res = await FetchApiPost(url, payload);
	
	if (res.status !== 'success') {
		const errorMessage = res.errorMessage || 'LOT 조건부 검색 실패';
		throw new Error(errorMessage);
	}
	return res.data;
};

export const getLotFields = async (fieldName: string) => {
	const res = await FetchApiGet(`/production/lot/master/fields/${fieldName}`);
	if (res.status !== "success") {
		throw new Error("LotMaster 필드 조회 실패");
	}
	return res.data;
};
