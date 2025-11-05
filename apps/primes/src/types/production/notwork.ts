/**
 * Notwork 관련 타입 정의 (Swagger 기반 재구성)
 * API: /notwork/master, /notwork/detail
 */

// Master 엔티티 (Swagger 기반)
export interface NotworkMaster {
	id: number;
	tenantId?: string;
	isDelete?: boolean;
	useState?: string;
	createdBy?: string;
	createdAt?: string;
	updatedBy?: string;
	updatedAt?: string;
	// Master 전용 필드
	workDate?: string;
	machineId?: number;
	machineCode?: string;
	machineName?: string;
	jobType?: string;
	totalNotworkMinute?: number;
	description?: string;
}

// Detail 엔티티 (Swagger 기반 완전 필드)
export interface NotworkDetail {
	id: number;
	tenantId?: string;
	isDelete?: boolean;
	useState?: string;
	createdBy?: string;
	createdAt?: string;
	updatedBy?: string;
	updatedAt?: string;
	// Detail 전용 필드 (Swagger 분석 기반)
	notworkMasterId?: number;
	itemNo?: string;
	progressNo?: string;
	commandNo?: string;
	workCode?: string;
	notworkMinute?: number;
	startTime?: string;
	endTime?: string;
	notworkCode?: string;
	notworkName?: string;
	notworkReasonCode?: string;
	notworkReasonName?: string;
	contents?: string;
	worker?: string;
}

// 생성 Payload (Swagger 기반)
export interface CreateNotworkMasterPayload {
	// Master 생성 필드 (Swagger POST 분석)
	workDate?: string;
	machineId?: number;
	machineCode?: string;
	machineName?: string;
	jobType?: string;
	totalNotworkMinute?: number;
	description?: string;
}

export interface CreateNotworkDetailPayload {
	// Detail 생성 필드 (Swagger create_fields)
	notworkMasterId?: number;
	itemNo?: string;
	progressNo?: string;
	commandNo?: string;
	workCode?: string;
	notworkMinute?: number;
	startTime?: string;
	endTime?: string;
	notworkCode?: string;
	notworkName?: string;
	notworkReasonCode?: string;
	notworkReasonName?: string;
	contents?: string;
	worker?: string;
}

// 수정 Payload (Swagger 기반)
export interface UpdateNotworkMasterPayload {
	// Master 수정 필드 (Swagger PUT 분석)
	workDate?: string;
	machineId?: number;
	machineCode?: string;
	machineName?: string;
	jobType?: string;
	totalNotworkMinute?: number;
	description?: string;
}

export interface UpdateNotworkDetailPayload {
	// Detail 수정 필드 (Swagger update_fields)
	notworkMasterId?: number;
	itemNo?: string;
	progressNo?: string;
	commandNo?: string;
	workCode?: string;
	notworkMinute?: number;
	startTime?: string;
	endTime?: string;
	notworkCode?: string;
	notworkName?: string;
	notworkReasonCode?: string;
	notworkReasonName?: string;
	contents?: string;
	worker?: string;
}

// 검색 파라미터 (확장)
export interface NotworkMasterSearchParams {
	workDate?: string;
	machineId?: number;
	machineCode?: string;
	machineName?: string;
	jobType?: string;
	// 추가 검색 필드
	startDate?: string;
	endDate?: string;
}

export interface NotworkDetailSearchParams {
	notworkMasterId?: number;
	workCode?: string;
	commandNo?: string;
	notworkCode?: string;
	notworkReasonCode?: string;
	worker?: string;
	// 추가 검색 필드
	startTime?: string;
	endTime?: string;
	itemNo?: string;
	progressNo?: string;
}

// API 응답 타입
export interface NotworkMasterListResponse {
	content: NotworkMaster[];
	totalElements: number;
	totalPages: number;
	size: number;
	number: number;
}

export interface NotworkDetailListResponse {
	content: NotworkDetail[];
	totalElements: number;
	totalPages: number;
	size: number;
	number: number;
}

// Field API 타입
export interface NotworkFieldOption {
	id: number | string;
	value: string;
	code?: string;
	disabled?: boolean;
}

// Batch 생성을 위한 타입
export interface CreateNotworkMasterBatchPayload {
	dataList: CreateNotworkMasterPayload[];
}

export interface CreateNotworkDetailBatchPayload {
	dataList: CreateNotworkDetailPayload[];
}

// 리스트 파라미터 타입
export interface NotworkMasterListParams extends NotworkMasterSearchParams {
	page?: number;
	size?: number;
}

export interface NotworkDetailListParams extends NotworkDetailSearchParams {
	page?: number;
	size?: number;
}
