// Production 도메인 공통 타입 정의

// 공통 Field API 타입
export interface FieldQueryParams {
	search?: string;
	limit?: number;
}

export interface FieldOption {
	id: number | string;
	value: string;
	code?: string;
	disabled?: boolean;
}

// 공통 API 응답 타입
export interface ApiResponse<T> {
	status: 'success' | 'error';
	data?: T;
	errorMessage?: string;
	errorCode?: string;
}

export interface PaginatedResponse<T> {
	content: T[];
	totalElements: number;
	totalPages: number;
	size: number;
	number: number;
	first: boolean;
	last: boolean;
	empty: boolean;
}

// 공통 검색 및 정렬 타입
export interface BaseSearchRequest {
	page?: number;
	size?: number;
	sort?: string;
	direction?: 'ASC' | 'DESC';
}

export interface DateRangeFilter {
	startDate?: string;
	endDate?: string;
}

// 공통 상태 타입
export type Status =
	| 'ACTIVE'
	| 'INACTIVE'
	| 'PENDING'
	| 'COMPLETED'
	| 'CANCELLED'
	| 'IN_PROGRESS';
export type Urgency = 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT';
export type Priority = 1 | 2 | 3 | 4 | 5;

// 공통 엔티티 기본 필드
export interface BaseEntity {
	id: number;
	createdAt?: string;
	updatedAt?: string;
	createdBy?: string;
	updatedBy?: string;
}

// 공통 감사(Audit) 필드
export interface AuditFields {
	createdAt: string;
	updatedAt: string;
	createdBy: string;
	updatedBy?: string;
}

// 공통 활성화/비활성화 필드
export interface ActivatableEntity extends BaseEntity {
	isActive: boolean;
	activatedAt?: string;
	deactivatedAt?: string;
}

// 공통 승인 워크플로우 필드
export interface ApprovableEntity extends BaseEntity {
	status: Status;
	requestedBy?: string;
	requestedAt?: string;
	approvedBy?: string;
	approvedAt?: string;
	rejectedBy?: string;
	rejectedAt?: string;
	rejectionReason?: string;
}
