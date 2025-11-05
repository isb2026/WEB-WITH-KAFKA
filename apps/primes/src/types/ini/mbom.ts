// Mbom 관련 타입 정의 (initServiceAPI.json 기반)

/**
 * Mbom Create 요청 (API 스키마 업데이트)
 */
export interface MbomCreateRequest {
	parentItemId: number | null; // 부모 item_id (완제품인 경우 null)
	itemId: number; // item_id
	isRoot?: boolean; // 완제품 여부 (true: 완제품, false: 투입품)
	parentProgressId?: number; // 투입될 부모의 공정 ID
	inputNum: number; // 부품 투입량
	itemProgressId?: number; // 아이템의 투입공정ID
	inputUnitCode: string; // 투입단위
	inputUnit?: string; // 단위명
}

/**
 * Mbom Update 요청 (API 스키마 업데이트)
 */
export interface MbomUpdateRequest {
	parentItemId?: number; // 부모 item_id (완제품인 경우 null)
	itemId?: number; // item_id
	isRoot?: boolean; // 완제품 여부 (true: 완제품, false: 투입품)
	parentProgressId?: number; // 투입될 부모의 공정 ID
	inputNum?: number; // 부품 투입량
	itemProgressId?: number; // 아이템의 투입공정ID
	inputUnitCode?: string; // 투입단위
	inputUnit?: string; // 단위명
}

/**
 * Mbom Update All 요청 (API 스키마 업데이트)
 */
export interface MbomUpdateAllRequest {
	id: number; // ID
	parentItemId?: number; // 부모 item_id (완제품인 경우 null)
	itemId?: number; // item_id
	isRoot?: boolean; // 완제품 여부 (true: 완제품, false: 투입품)
	parentProgressId?: number; // 투입될 부모의 공정 ID
	inputNum?: number; // 부품 투입량
	itemProgressId?: number; // 아이템의 투입공정ID
	inputUnitCode?: string; // 투입단위
	inputUnit?: string; // 단위명
}

/**
 * Mbom DTO (initServiceAPI.json 스키마 기반)
 */
export interface MbomDto {
	id: number;
	tenantId: number;
	isDelete: boolean;
	parentItemId: number; // 부모 item_id
	itemId: number; // item_id
	isRoot: boolean; // 완제품 여부
	parentProgressId: number; // 투입될 부모의 공정 ID
	inputNum: number; // 부품 투입량 (float)
	itemProgressId: number; // 아이템의 투입공정ID
	inputUnitCode: string; // 투입단위 코드
	inputUnit: string; // 투입단위 명
	createdBy: string;
	createdAt: string; // date-time format
	updatedBy: string;
	updatedAt: string; // date-time format
}

/**
 * MbomListDto (완제품별 투입품 리스트용 - initServiceAPI.json 기반)
 */
export interface MbomListDto {
	id: number;
	tenantId: number;
	isDelete: boolean;
	parentItemId: number;
	itemId: number;
	isRoot: boolean;
	parentProgressId: number;
	itemProgressId: number;
	inputNum: number; // float
	inputUnitCode: string;
	inputUnit: string;
	item: ItemInfo; // ItemInfo 참조
	parentProgress: ProgressInfo; // 부모 공정 정보
	itemProgress: ProgressInfo; // 아이템 공정 정보
	depth: number; // 계층 깊이
	path: string; // 경로 정보
	sequence: number; // 순서
	hasChildren: boolean; // 하위 아이템 존재 여부
	childrenCount: number; // 하위 아이템 개수
	createdBy: string;
	createdAt: string;
	updatedBy: string;
	updatedAt: string;
}

/**
 * ItemInfo (API 스키마 기반)
 */
export interface ItemInfo {
	id: number;
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
	isUse: boolean;
}

/**
 * ProgressInfo (API 스키마 기반)
 */
export interface ProgressInfo {
	id: number;
	progressName: string;
	progressOrder: number;
	progressTypeCode: string;
	progressTypeName: string;
	isOutsourcing: boolean;
	defaultCycleTime: number;
	progressDefaultSpec: string;
	keyManagementContents: string;
}

/**
 * ProcessTreeNode DTO (TreeView UI용)
 */
export interface ProcessTreeNodeDto {
	id: string;
	label: string;
	icon: string;
	disabled: boolean;
	progressId: number;
	progressName: string;
	progressOrder: string;
	progressTypeName: string;
	isOutsourcing: boolean;
	defaultCycleTime: number;
	itemId: number;
	itemName: string;
	itemNumber: string;
	mbomId: number;
	rootItemId: number;
	parentItemId: number;
	inputNum: number;
	inputUnit: string;
	inputUnitCode: string;
	nodeType: string;
	level: number;
	path: string;
	hasChildren: boolean;
	childrenCount: number;
	children?: ProcessTreeNodeDto[]; // 자식 노드들
	tenantId: number;
	createdBy: string;
	createdAt: string;
	updatedBy: string;
	updatedAt: string;
}

/**
 * 제품 정보 DTO
 */
export interface ProductInfoDto {
	itemId: number;
	itemName: string;
	itemCode: string;
	description: string;
	itemType: string;
	unit: string;
	isActive: boolean;
}

/**
 * 투입품 정보 DTO
 */
export interface InputItemDto {
	mbomId: number;
	itemId: number;
	itemName: string;
	inputNum: number;
	inputUnitCode: string;
	inputUnit: string;
	path: string;
	productInfo: ProductInfoDto;
	createdAt: string;
	createdBy: string;
}

/**
 * 공정 노드 DTO
 */
export interface ProcessNodeDto {
	progressId: number;
	progressOrder: number;
	progressName: string;
	progressTypeName: string;
	inputItems: InputItemDto[];
	path: string;
	inputItemCount: number;
}

/**
 * 루트 아이템 트리 DTO (새로운 구조)
 */
export interface RootItemTreeDto {
	rootItemId: number;
	productInfo: ProductInfoDto;
	processTree: ProcessNodeDto[];
	totalProcessCount: number;
	totalInputItemCount: number;
}

/**
 * 전체 BOM 트리 DTO (새로운 구조)
 */
export interface FullBomTreeDto {
	rootItems: RootItemTreeDto[];
	totalCount: number;
	rootItemCount: number;
}

/**
 * 루트 아이템 DTO (기존 호환성을 위해 유지)
 * @deprecated 새로운 RootItemTreeDto 사용 권장
 */
export interface RootItemDto {
	rootItemId: number;
	rootItemName: string;
	processTree: ProcessTreeNodeDto[];
	totalProcessCount: number;
	totalInputItemCount: number;
}

/**
 * BOM 관계 추가 가능 여부 검증 요청
 */
export interface CanAddRelationRequest {
	rootItemId: number;
	parentItemId: number;
	childItemId: number;
}

/**
 * BOM 관계 추가 가능 여부 검증 응답
 */
export interface CanAddRelationResponse {
	canAdd: boolean;
	reason?: string;
}

/**
 * 공통 응답 래퍼
 */
export interface CommonResponse<T> {
	success: boolean;
	message: string;
	data: T;
}

/**
 * 페이지 응답
 */
export interface PageResponse<T> {
	content: T[];
	totalElements: number;
	totalPages: number;
	size: number;
	number: number;
	first: boolean;
	last: boolean;
}

/**
 * Mbom 검색 요청 (API 스키마 기반)
 */
export interface MbomSearchRequest {
	parentItemId?: number; // 부모 item_id
	itemId?: number; // item_id
	isRoot?: boolean; // 완제품 여부
	parentProgressId?: number; // 투입될 부모의 공정 ID
	itemProgressId?: number; // 아이템의 투입공정ID
	inputUnitCode?: string; // 투입단위
	inputUnit?: string; // 단위명
	// 공통 검색 필드
	isUse?: boolean;
	createdAtStart?: string;
	createdAtEnd?: string;
	createdBy?: string;
	updatedAtStart?: string;
	updatedAtEnd?: string;
	updatedBy?: string;
}
