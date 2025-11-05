import { CheckingSampleData } from './checkingSample';
/**
 * QMS 검사 헤드 타입 정의
 * Swagger API 기반: /api/checking/heads
 */

// 기본 검사 헤드 데이터 타입
export interface CheckingHeadData {
	id: number;
	isUse: boolean;
	inspectionType: string;
	targetId: number;
	targetCode: string;
	checkingName: string;
	checkingFormulaId?: number;
	formula?: string;
	meta?: JSON;
	orderNo?: number;
	standard?: string;
	standardUnit?: string;
	checkPeriod?: number;
	sampleQuantity?: number;
	createdAt: string;
	updatedAt: string;
	createdBy: string;
	updatedBy: string;
	checkingSamples?: CheckingSampleData[];
}

// 검사 헤드 생성 Payload (배치 생성 지원)
export interface CreateCheckingHeadPayload {
	inspectionType: string;
	targetId: number;
	targetCode: string;
	checkingName: string;
	checkingFormulaId?: number;
	formula?: string;
	meta?: JSON;
	orderNo?: number;
	standard?: string;
	standardUnit?: string;
	checkPeriod?: number;
	sampleQuantity?: number;
	isPass: boolean;
}

// 검사 헤드 수정 Payload (Swagger 검증된 5개 필드)
export interface UpdateCheckingHeadPayload {
	isUse: boolean;
	inspectionType: string;
	targetId: number;
	targetCode: string;
	checkingName: string;
}

// 검사 헤드 목록 조회 파라미터
export interface CheckingHeadListParams {
	page?: number;
	size?: number;
	searchRequest?: {
		checkingName?: string;
		inspectionType?: string;
		targetCode?: string;
		targetId?: number;
		isUse?: boolean;
		[key: string]: any;
	};
}

// 검사 헤드 검색 파라미터
export interface CheckingHeadSearchParams {
	checkingName?: string;
	inspectionType?: string;
	inspectionTypes?: string[]; // 여러 검사 타입을 배열로 지원
	targetId?: number;
	targetCode?: string;
	isUse?: boolean;
	dateFrom?: string;
	dateTo?: string;
	[key: string]: any;
}

// API 응답 타입
export interface CheckingHeadListResponse {
	content: CheckingHeadData[];
	totalElements: number;
	totalPages: number;
	size: number;
	number: number;
	numberOfElements: number;
	first: boolean;
	last: boolean;
	empty: boolean;
}

// Field API 응답 타입
export interface CheckingHeadFieldOption {
	id: number | string;
	value: string;
	code?: string;
	disabled?: boolean;
}

// 배치 생성용 타입 (dataList 구조)
export interface CreateCheckingHeadBatchPayload {
	dataList: CreateCheckingHeadPayload[];
}
