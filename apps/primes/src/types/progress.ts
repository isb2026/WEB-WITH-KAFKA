import { Pageable, Sort } from './common';
import { FileLinkDto } from './fileUrl';

// Swagger-based ItemProgress Types

// ItemProgressSearchRequest - ItemProgress 검색 요청
export interface ItemProgressSearchRequest {
	isUse?: boolean; // 사용 여부
	createdAtStart?: string; // 생성일시 시작
	createdAtEnd?: string; // 생성일시 종료
	createdBy?: string; // 생성자
	updatedAtStart?: string; // 수정일시 시작
	updatedAtEnd?: string; // 수정일시 종료
	updatedBy?: string; // 수정자
	id?: number; // ID
	accountYear?: number; // 데이터 회계년
	itemId?: number; // item 테이블 참조
	progressOrder?: number; // 공정 순서
	progressName?: string; // 공정 이름
	isOutsourcing?: boolean; // 외주 공정 여부 (0: 내공정, 1: 외주)
	// 새로운 필드들 추가
	progressTypeCode?: string; // 공정 타입 코드
	progressTypeName?: string; // 공정 타입명
	progressRealName?: string; // 공정 실명
	defaultCycleTime?: number; // 기본 사이클 타임
	optimalProgressInventoryQty?: number; // 적정 공정 재고량
	safetyProgressInventoryQty?: number; // 안전 공정 재고량
	progressDefaultSpec?: string; // 공정 기본 사양
	keyManagementContents?: string; // 핵심 관리 내용
	// 단위 관련 필드들 추가
	unitWeight?: number; // 공정단중
	unitTypeName?: string; // 공정단중의 단위
	unitTypeCode?: string; // 공정단중 단위 Code값
}

// ItemProgressCreateRequest - ItemProgress Create 요청
export interface ItemProgressCreateRequest {
	accountYear?: number; // 데이터 회계년
	itemId?: number; // item 테이블 참조
	progressOrder?: number; // 공정 순서
	progressName: string; // 공정 이름 (required)
	isOutsourcing?: boolean; // 외주 공정 여부 (0: 내공정, 1: 외주)
	// 새로운 필드들 추가
	progressTypeCode?: string; // 공정 타입 코드
	progressTypeName?: string; // 공정 타입명
	progressRealName?: string; // 공정 실명
	defaultCycleTime?: number; // 기본 사이클 타임
	optimalProgressInventoryQty?: number; // 적정 공정 재고량
	safetyProgressInventoryQty?: number; // 안전 공정 재고량
	progressDefaultSpec?: string; // 공정 기본 사양
	keyManagementContents?: string; // 핵심 관리 내용
	// 단위 관련 필드들 추가
	unitWeight?: number; // 공정단중
	unitTypeName?: string; // 공정단중의 단위
	unitTypeCode?: string; // 공정단중 단위 Code값
}

// ItemProgressListCreateRequest - ItemProgress 리스트 Create 요청
export interface ItemProgressListCreateRequest {
	dataList: ItemProgressCreateRequest[]; // 생성할 ItemProgress 데이터 리스트
}

// ItemProgressUpdateRequest - ItemProgress Update 요청
export interface ItemProgressUpdateRequest {
	isUse?: boolean; // 사용여부
	accountYear?: number; // 데이터 회계년
	itemId?: number; // item 테이블 참조
	progressOrder?: number; // 공정 순서
	progressName?: string; // 공정 이름
	isOutsourcing?: boolean; // 외주 공정 여부 (0: 내공정, 1: 외주)
	// 새로운 필드들 추가
	progressTypeCode?: string; // 공정 타입 코드
	progressTypeName?: string; // 공정 타입명
	progressRealName?: string; // 공정 실명
	defaultCycleTime?: number; // 기본 사이클 타임
	optimalProgressInventoryQty?: number; // 적정 공정 재고량
	safetyProgressInventoryQty?: number; // 안전 공정 재고량
	progressDefaultSpec?: string; // 공정 기본 사양
	keyManagementContents?: string; // 핵심 관리 내용
	// 단위 관련 필드들 추가
	unitWeight?: number; // 공정단중
	unitTypeName?: string; // 공정단중의 단위
	unitTypeCode?: string; // 공정단중 단위 Code값
}

// ItemProgressUpdateAllRequest - ItemProgress 일괄 Update 요청
export interface ItemProgressUpdateAllRequest {
	id: number; // ID
	isUse?: boolean; // 사용여부
	accountYear?: number; // 데이터 회계년
	itemId?: number; // item 테이블 참조
	progressOrder?: number; // 공정 순서
	progressName?: string; // 공정 이름
	isOutsourcing?: boolean; // 외주 공정 여부 (0: 내공정, 1: 외주)
	// 새로운 필드들 추가
	progressTypeCode?: string; // 공정 타입 코드
	progressTypeName?: string; // 공정 타입명
	progressRealName?: string; // 공정 실명
	defaultCycleTime?: number; // 기본 사이클 타임
	optimalProgressInventoryQty?: number; // 적정 공정 재고량
	safetyProgressInventoryQty?: number; // 안전 공정 재고량
	progressDefaultSpec?: string; // 공정 기본 사양
	keyManagementContents?: string; // 핵심 관리 내용
	// 단위 관련 필드들 추가
	unitWeight?: number; // 공정단중
	unitTypeName?: string; // 공정단중의 단위
	unitTypeCode?: string; // 공정단중 단위 Code값
}

// ItemDto - Item 응답 데이터 (중첩된 item)
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
	itemProgress: string[]; // itemProgress 배열 (순환 참조 방지를 위해 string[]로 정의)
	progressRoutes: any[]; // progressRoutes 배열 (순환 참조 방지를 위해 any[]로 정의)
	fileUrls: FileLinkDto[]; // fileUrls 배열
}

// ProgressRouteDto - ProgressRoute 응답 데이터 (인라인 정의)
export interface ProgressRouteDto {
	id: number;
	tenantId: number;
	isDelete: boolean;
	isUse: boolean;
	itemId: number;
	item: string; // ItemDto (순환 참조 방지를 위해 string으로 정의)
	progressSequence: string; // byte 형식
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
	createdAt: string; // ISO date string
	updatedBy: string;
	updatedAt: string; // ISO date string
}

// ItemProgressDto - ItemProgress 응답 데이터 (새로운 스키마 기반)
export interface ItemProgressDto {
	id: number;
	tenantId: number;
	isDelete: boolean;
	isUse: boolean;
	accountYear: number;
	itemId: number;
	item: ItemDto; // 중첩된 ItemDto
	progressOrder: number; // 공정 순서
	progressName: string;
	isOutsourcing: boolean;
	// 새로운 필드들 추가
	progressTypeCode: string;
	progressTypeName: string;
	progressRealName: string;
	defaultCycleTime: number;
	optimalProgressInventoryQty: number;
	safetyProgressInventoryQty: number;
	progressDefaultSpec: string;
	keyManagementContents: string;
	// 단위 관련 필드들 추가
	unitWeight: number; // 공정단중
	unitTypeName: string; // 공정단중의 단위
	unitTypeCode: string; // 공정단중 단위 Code값
	createdBy: string;
	createdAt: string; // ISO date string
	updatedBy: string;
	updatedAt: string; // ISO date string
}

// Legacy types for backward compatibility
export interface GetAllProgressListPayload {
	page: number;
	size: number;
	searchRequest?: ItemProgressSearchRequest;
}

export interface SearchProgressRequest extends ItemProgressSearchRequest {}
export interface CreateProgressPayload extends ItemProgressCreateRequest {}
export interface Progress extends ItemProgressDto {}

export interface ProgressListResponse {
	totalElements: number;
	totalPages: number;
	size: number;
	content: ItemProgressDto[];
	number: number;
	sort: Sort;
	numberOfElements: number;
	pageable: Pageable;
	first: boolean;
	last: boolean;
	empty: boolean;
}
