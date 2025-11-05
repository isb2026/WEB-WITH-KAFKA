import {
	FetchApiPost,
	FetchApiGet,
	FetchApiPut,
	FetchApiDelete,
	getSearchParams,
} from '@primes/utils/request';
import {
	ItemSearchRequest,
	ItemCreateRequest,
	ItemUpdateRequest,
	ItemListCreateRequest,
	ItemUpdateAllRequest,
} from '@primes/types/item';

// Item 조회 (GET /item)
export const getItemList = async ({
	searchRequest,
	page = 0,
	size = 10,
}: {
	searchRequest: ItemSearchRequest;
	page?: number;
	size?: number;
}) => {
	// Removed artificial delay for better performance

	const searchParams = getSearchParams(searchRequest);
	const res = await FetchApiGet(
		`/init/item?page=${page}&size=${size}&${searchParams}`
	);
	if (res.status !== 'success') {
		throw new Error(res.errorMessage || 'Item 목록 조회 실패');
	}
	return res.data;
};

// Item 생성 (POST /item)
export const createItem = async (data: Partial<ItemCreateRequest>) => {
	// Extract only allowed keys based on Swagger
	const {
		isUse,
		itemNo,
		itemNumber,
		itemName,
		itemSpec,
		itemModel,
		itemType1Code,
		itemType2Code,
		itemType3Code,
		itemUnit,
		lotSizeCode,
		optimalInventoryQty,
		safetyInventoryQty,
		fileUrls,
	} = data as any;

	// Clean params - remove undefined values to match backend expectations
	const cleanedParams: any = {};

	// Note: isUse and itemNo are NOT included in create requests per backend spec
	// They are auto-generated/set by the backend
	if (itemNumber !== undefined) cleanedParams.itemNumber = itemNumber;
	if (itemName !== undefined) cleanedParams.itemName = itemName;
	if (itemSpec !== undefined) cleanedParams.itemSpec = itemSpec;
	if (itemModel !== undefined) cleanedParams.itemModel = itemModel;
	if (itemType1Code !== undefined)
		cleanedParams.itemType1Code = itemType1Code;
	if (itemType2Code !== undefined)
		cleanedParams.itemType2Code = itemType2Code;
	if (itemType3Code !== undefined)
		cleanedParams.itemType3Code = itemType3Code;
	if (itemUnit !== undefined) cleanedParams.itemUnit = itemUnit;
	if (lotSizeCode !== undefined) cleanedParams.lotSizeCode = lotSizeCode;
	if (optimalInventoryQty !== undefined)
		cleanedParams.optimalInventoryQty = optimalInventoryQty;
	if (safetyInventoryQty !== undefined)
		cleanedParams.safetyInventoryQty = safetyInventoryQty;
	if (fileUrls !== undefined && fileUrls.length > 0)
		cleanedParams.fileUrls = fileUrls;

	const requestBody: ItemListCreateRequest = [cleanedParams];

	const res = await FetchApiPost('/init/item', requestBody);
	if (res.status !== 'success') {
		throw new Error(res.errorMessage || 'Item 생성 실패');
	}
	return res.data;
};

// Item 일괄 수정 (PUT /item)
export const updateItemBulk = async (items: ItemUpdateAllRequest[]) => {
	const res = await FetchApiPut('/init/item', items);
	if (res.status !== 'success') {
		throw new Error(res.errorMessage || 'Item 일괄 수정 실패');
	}
	return res.data;
};

// Item 수정 (PUT /item) - Array format like create
export const updateItem = async (
	id: number,
	data: Partial<ItemUpdateRequest>
) => {
	const {
		isUse,
		itemNo,
		itemNumber,
		itemName,
		itemSpec,
		itemModel,
		itemType1Code,
		itemType2Code,
		itemType3Code,
		itemUnit,
		lotSizeCode,
		optimalInventoryQty,
		safetyInventoryQty,
		fileUrls,
	} = data;

	// fileUrls 데이터 정리 - 백엔드 FileLinkUpdateInfo 구조에 맞게 변환 (id는 있을 때만 포함)
	const cleanedFileUrls = (fileUrls || []).map((file) => {
		const v: any = {
			url:
				typeof file.url === 'string'
					? file.url
					: (file.url as any)?.toString() || '',
			ownerType: file.ownerType,
			sortOrder: file.sortOrder,
			isPrimary: file.isPrimary,
			description: file.description,
		};
		if (file.id !== undefined && file.id !== null) {
			v.id = file.id;
		}
		return v;
	});

	// Clean params - remove undefined values to match backend expectations
	const cleanedParams: any = {
		id: id, // Always include ID for update
	};

	// isUse defaults to true if not specified
	cleanedParams.isUse = isUse !== undefined ? isUse : true;

	if (itemNo !== undefined) cleanedParams.itemNo = itemNo;
	if (itemNumber !== undefined) cleanedParams.itemNumber = itemNumber;
	if (itemName !== undefined) cleanedParams.itemName = itemName;
	if (itemSpec !== undefined) cleanedParams.itemSpec = itemSpec;
	if (itemModel !== undefined) cleanedParams.itemModel = itemModel;
	if (itemType1Code !== undefined)
		cleanedParams.itemType1Code = itemType1Code;
	if (itemType2Code !== undefined)
		cleanedParams.itemType2Code = itemType2Code;
	if (itemType3Code !== undefined)
		cleanedParams.itemType3Code = itemType3Code;
	if (itemUnit !== undefined) cleanedParams.itemUnit = itemUnit;
	if (lotSizeCode !== undefined) cleanedParams.lotSizeCode = lotSizeCode;
	if (optimalInventoryQty !== undefined)
		cleanedParams.optimalInventoryQty = optimalInventoryQty;
	if (safetyInventoryQty !== undefined)
		cleanedParams.safetyInventoryQty = safetyInventoryQty;

	// fileUrls는 있을 때만 포함 (이미지 변경 없으면 누락)
	if (cleanedFileUrls.length > 0) {
		cleanedParams.fileUrls = cleanedFileUrls;
	}

	// Wrap in array format to match backend expectation
	const requestBody = [cleanedParams];

	// console.log('🔍 Item Update Request Body:', JSON.stringify(requestBody, null, 2));

	const res = await FetchApiPut('/init/item', requestBody);
	if (res.status !== 'success') {
		throw new Error(res.errorMessage || 'Item 수정 실패');
	}
	return res.data;
};

// Item 삭제 (DELETE /item)
export const deleteItem = async (ids: number[]) => {
	const res = await FetchApiDelete('/init/item', undefined, ids);
	if (res.status !== 'success') {
		throw new Error(res.errorMessage || 'Item 삭제 실패');
	}
	return res.data;
};

// Item 특정 필드 값 전체 조회 (GET /item/fields/{fieldName})
export const getItemFieldValues = async (fieldName: string) => {
	const res = await FetchApiGet(`/init/item/fields/${fieldName}`);
	if (res.status !== 'success') {
		throw new Error(res.errorMessage || 'Item 필드 조회 실패');
	}
	return res.data;
};

// Legacy function names for backward compatibility
export const getAllItemList = getItemList;
export const getfieldName = getItemFieldValues;
export const searchItem = getItemList;
