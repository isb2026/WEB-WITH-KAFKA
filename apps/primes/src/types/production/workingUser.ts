/**
 * Working User 관련 타입 정의
 * API: /working-user
 */

// 엔티티
export interface WorkingUser {
	id: number;
	tenantId?: string;
	isDelete?: boolean;
	useState?: string;
	createdBy?: string;
	createdAt?: string;
	updatedBy?: string;
	updatedAt?: string;
	workingMasterId?: number;
	userNo?: string;
	workerName?: string;
	gongsu?: number;
}

// 생성 Payload
export interface CreateWorkingUserPayload {
	workingMasterId?: number;
	userNo?: string;
	workerName?: string;
	gongsu?: number;
}

// 수정 Payload
export interface UpdateWorkingUserPayload {
	workingMasterId?: number;
	userNo?: string;
	workerName?: string;
	gongsu?: number;
}

// 검색 파라미터
export interface WorkingUserSearchParams {
	workingMasterId?: number;
	userNo?: string;
	workerName?: string;
}

// API 응답 타입
export interface WorkingUserListResponse {
	content: WorkingUser[];
	totalElements: number;
	totalPages: number;
	size: number;
	number: number;
}

// Field API 타입 (공통 FieldOption 사용)
// FieldOption은 common.ts에서 가져옴
