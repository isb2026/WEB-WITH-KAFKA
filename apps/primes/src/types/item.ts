import { Pageable, Sort } from './common';
import { FileLinkDto, FileLinkUpdateInfo } from './fileUrl';

// Swagger-based Item Types

// ItemSearchRequest - Item 검색 요청
export interface ItemSearchRequest {
	isUse?: boolean; // 사용 여부
	createdAtStart?: string; // 생성일시 시작
	createdAtEnd?: string; // 생성일시 종료
	createdBy?: string; // 생성자
	updatedAtStart?: string; // 수정일시 시작
	updatedAtEnd?: string; // 수정일시 종료
	updatedBy?: string; // 수정자
	id?: number; // ID
	itemNo?: number; // 아이템번호
	itemNumber?: string; // 품번
	itemName?: string; // 품명
	itemSpec?: string; // 규격
	itemModel?: string; // 모델명
	itemType1Code?: string; // 제품대분류 코드
	itemType2Code?: string; // 제품중분류 코드
	itemType3Code?: string; // 제품소분류 코드
	itemUnit?: string; // 단위
	lotSizeCode?: string; // Lot 사이즈 코드
	optimalInventoryQty?: number; // 적정재고량
	safetyInventoryQty?: number; // 안전재고량
}

// ItemCreateRequest - Item Create 요청
export interface ItemCreateRequest {
	isUse?: boolean; // 사용여부
	itemNo?: number; // 아이템번호
	itemNumber?: string; // 품번
	itemName?: string; // 품명
	itemSpec?: string; // 규격
	itemModel?: string; // 모델명
	itemType1Code?: string; // 제품대분류 코드
	itemType2Code?: string; // 제품중분류 코드
	itemType3Code?: string; // 제품소분류 코드
	itemUnit?: string; // 단위
	lotSizeCode?: string; // Lot 사이즈 코드
	optimalInventoryQty?: number; // 적정재고량
	safetyInventoryQty?: number; // 안전재고량
	fileUrls?: FileLinkUpdateInfo[]; // 파일 링크 배열
}

// ItemListCreateRequest - Item 리스트 Create 요청
export type ItemListCreateRequest = ItemCreateRequest[];

// ItemUpdateRequest - Item Update 요청
export interface ItemUpdateRequest {
	isUse?: boolean; // 사용여부
	itemNo?: number; // 아이템번호
	itemNumber?: string; // 품번
	itemName?: string; // 품명
	itemSpec?: string; // 규격
	itemModel?: string; // 모델명
	itemType1Code?: string; // 제품대분류 코드
	itemType2Code?: string; // 제품중분류 코드
	itemType3Code?: string; // 제품소분류 코드
	itemUnit?: string; // 단위
	lotSizeCode?: string; // Lot 사이즈 코드
	optimalInventoryQty?: number; // 적정재고량
	safetyInventoryQty?: number; // 안전재고량
	fileUrls?: FileLinkUpdateInfo[]; // 파일 링크 배열
}

// ItemUpdateAllRequest - Item 일괄 Update 요청
export interface ItemUpdateAllRequest {
	id: number; // ID
	isUse?: boolean; // 사용여부
	itemNo?: number; // 아이템번호
	itemNumber?: string; // 품번
	itemName?: string; // 품명
	itemSpec?: string; // 규격
	itemModel?: string; // 모델명
	itemType1Code?: string; // 제품대분류 코드
	itemType2Code?: string; // 제품중분류 코드
	itemType3Code?: string; // 제품소분류 코드
	itemUnit?: string; // 단위
	lotSizeCode?: string; // Lot 사이즈 코드
	optimalInventoryQty?: number; // 적정재고량
	safetyInventoryQty?: number; // 안전재고량
}

// ItemDto - Item 응답 데이터
export interface ItemDto {
	id: number;
	tenantId: number;
	isDelete: boolean;
	isUse: boolean;
	itemNo: number;
	itemNumber: string;
	itemName: string;
	itemSpec: string;
	itemModel: string;
	itemType1: string;
	itemType2: string;
	itemType3: string;
	itemUnit: string;
	lotSize: string;
	optimalInventoryQty: number;
	safetyInventoryQty: number;
	createdBy: string;
	createdAt: string; // ISO date string
	updatedBy: string;
	updatedAt: string; // ISO date string
	progressRoutes: ProgressRouteDto[];
}

// ProgressRouteDto (referenced in ItemDto)
export interface ProgressRouteDto {
	id: number;
	tenantId: number;
	isDelete: boolean;
	isUse: boolean;
	itemId: number;
	item?: ItemDto;
	progressSequence: string;
	progressTypeCode: string;
	progressTypeName: string;
	progressRealName: string;
	defaultCycleTime: number;
	lotSize: number;
	lotUnit: string;
	optimalProgressInventoryQty: number;
	safetyProgressInventoryQty: number;
	progressDefaultSpec: string;
	keyManagementContents: string;
	createdBy: string;
	createdAt: string;
	updatedBy: string;
	updatedAt: string;
}

// Legacy types for backward compatibility
export interface GetAllItemListPayload {
	page: number;
	size: number;
	searchRequest?: ItemSearchRequest;
}

export interface GetSearchItemListPayload {
	page: number;
	size: number;
	searchRequest?: ItemSearchRequest;
}

export interface SearchItemRequest extends ItemSearchRequest {}

export interface ItemListResponse {
	totalElements: number;
	totalPages: number;
	size: number;
	content: ItemDto[];
	number: number;
	sort: Sort;
	numberOfElements: number;
	pageable: Pageable;
	first: boolean;
	last: boolean;
	empty: boolean;
}

// Main Item interface for UI usage
export interface Item {
	id: number;
	tenantId: number;
	isDelete: boolean;
	isUse: boolean;
	itemNo: number;
	itemNumber: string;
	itemName: string;
	itemSpec: string;
	itemModel: string;
	itemUnit: string;
	lotSize: string;
	optimalInventoryQty: number;
	safetyInventoryQty: number;
	createdBy: string;
	createdAt: string; // ISO date string
	updatedBy: string;
	updatedAt: string; // ISO date string

	// 기존 필드들
	itemType1: string;
	itemType2: string;
	itemType3: string;
	useState: boolean;
	progressRoutes?: ProgressRouteDto[];
	accountYear?: number;
	deleteState?: boolean;
	fileUrls?: FileLinkDto[]; // File links for images and documents

	// code 필드들 추가 (codeValue와 codeName)
	itemType1Code: string;
	itemType1Value: string;
	itemType2Code: string;
	itemType2Value: string;
	itemType3Code: string;
	itemType3Value: string;
	lotSizeCode: string;
	lotSizeValue: string;
}

export interface createItemPayload {
	itemNo?: number;
	itemModel?: string;
	itemName: string;
	itemNumber?: string;
	itemSpec?: string;
	itemUnit?: string;
	lotSize?: string;
	itemType1?: string;
	itemType2?: string;
	itemType3?: string;
	fileUrls?: FileLinkDto[]; // 파일 링크 배열
}
