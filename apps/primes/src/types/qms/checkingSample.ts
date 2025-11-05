/**
 * QMS 검사 샘플 타입 정의
 * Swagger API 기반: /api/checking/samples
 */

// 기본 검사 샘플 데이터 타입
export interface CheckingSampleData {
	id: number;
	checkingHeadId: number;
	sampleIndex: number;
	measuredValue: number;
	measureUnit: string;
	isPass: boolean;
	checkingName: string;
	orderNo: number;
	standard: string;
	standardUnit: string;
	isUse: boolean;
	inspectionType: string;
	targetId: number;
	targetCode: string;
	checkingFormulaId: number;
	formula: string;
	meta: string;
	createdAt: string;
	updatedAt: string;
	createdBy: string;
	updatedBy: string;
}

// 검사 샘플 생성 Payload (Swagger 검증된 9개 필드)
export interface CreateCheckingSamplePayload {
	checkingHeadId: number;
	sampleIndex: number;
	measuredValue: number;
	measureUnit: string;
	isPass: boolean;
	checkingName: string;
	orderNo: number;
	standard: string;
	standardUnit: string;
	meta?: string;
}

// 검사 샘플 수정 Payload (Swagger 검증된 9개 필드)
export interface UpdateCheckingSamplePayload {
	isUse: boolean;
	inspectionType: string;
	targetId: number;
	targetCode: string;
	checkingName: string;
	isPass: boolean;
	checkingFormulaId: number;
	formula: string;
	meta: string;
}

// 검사 샘플 목록 조회 파라미터
export interface CheckingSampleListParams {
	page?: number;
	size?: number;
	searchRequest?: {
		checkingHeadId?: number;
		checkingName?: string;
		isPass?: boolean;
		inspectionType?: string;
		targetCode?: string;
		isUse?: boolean;
		[key: string]: any;
	};
}

// 검사 샘플 검색 파라미터
export interface CheckingSampleSearchParams {
	checkingHeadId?: number;
	checkingName?: string;
	isPass?: boolean;
	inspectionType?: string;
	targetId?: number;
	targetCode?: string;
	isUse?: boolean;
	dateFrom?: string;
	dateTo?: string;
	[key: string]: any;
}

// API 응답 타입
export interface CheckingSampleListResponse {
	content: CheckingSampleData[];
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
export interface CheckingSampleFieldOption {
	id: number | string;
	value: string;
	code?: string;
	disabled?: boolean;
}

// 배치 생성용 타입 (dataList 구조)
export interface CreateCheckingSampleBatchPayload {
	dataList: CreateCheckingSamplePayload[];
}
