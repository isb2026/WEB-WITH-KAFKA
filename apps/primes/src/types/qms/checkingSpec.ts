/**
 * QMS 검사 규격 타입 정의
 * Swagger API 기반: /checking-spec
 */

// 메타 데이터 타입 정의
export interface CheckingSpecMeta {
	maxValue?: number;
	minValue?: number;
	tolerance?: number;
	referenceNote?: string;
	[key: string]: any; // 추가 메타 필드를 위한 인덱스 시그니처
}

// 기본 검사 규격 데이터 타입
export interface CheckingSpecData {
	id: number;
	isUse: boolean;
	inspectionType: string;
	specType: CheckingSpecType;
	checkingFormulaId: number;
	checkingName: string;
	orderNo: number;
	standard: string;
	standardUnit: string;
	checkPeriod?: string;
	sampleQuantity: number;
	targetId: number;
	targetCode: string;
	targetName: string;
	meta: CheckingSpecMeta | null; // 파싱된 객체 또는 null
	createdAt: string;
	updatedAt: string;
	createdBy: string;
	updatedBy: string;
}

// 검사 규격 생성 Payload (Swagger 검증된 12개 필드)
export interface CreateCheckingSpecPayload {
	inspectionType: string;
	specType: CheckingSpecType;
	checkingFormulaId: number;
	checkingName: string;
	orderNo: number;
	standard: string;
	standardUnit: string;
	checkPeriod?: string;
	sampleQuantity: number;
	targetId: number;
	targetCode: string;
	targetName: string;
	meta: string;
	formula?: string; // 추가 필드
}

// 검사 규격 수정 Payload (Swagger 검증된 14개 필드)
export interface UpdateCheckingSpecPayload {
	isUse: boolean;
	inspectionType: string;
	specType: CheckingSpecType;
	checkingFormulaId: number;
	checkingName: string;
	orderNo: number;
	standard: string;
	standardUnit: string;
	checkPeriod?: string;
	sampleQuantity: number;
	targetId: number;
	targetCode: string;
	targetName: string;
	meta: string;
	formula?: string; // 추가 필드
}

// 검사 규격 목록 조회 파라미터
export interface CheckingSpecListParams {
	page?: number;
	size?: number;
	searchRequest?: CheckingSpecSearchRequest;
}

export interface CheckingSpecSearchRequest {
	checkingName?: string;
	inspectionType?: string;
	inspectionTypes?: string[]; // 여러 검사 타입을 배열로 지원
	specType?: CheckingSpecType;
	targetId?: number;
	targetCode?: string;
	isUse?: boolean;
	dateFrom?: string;
	dateTo?: string;
	[key: string]: any;
}

// API 응답 타입
export interface CheckingSpecListResponse {
	content: CheckingSpecData[];
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
export interface CheckingSpecFieldOption {
	id: number | string;
	value: string;
	code?: string;
	disabled?: boolean;
}

export interface CheckingSpecType {
	CHOICE: string;
	ONE_SIDED: string;
	TOLERANCE: string;
	RANGE: string;
	REFERENCE: string;
}