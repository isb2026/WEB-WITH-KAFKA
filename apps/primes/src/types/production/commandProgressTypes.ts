// CommandProgress 기본 DTO
export interface CommandProgressDto {
	id: number;
	tenantId: string;
	isDelete: boolean;
	progressId: number;
	progressCode?: string;
	progressName?: string;
	progressOrder?: number;
	isOutsourcing?: boolean;
	keyManagementContent?: string;
	commandId: number;
	commandNo?: string;
	createDate?: string;
	updateDate?: string;
}

// CommandProgress 검색 요청 타입
export interface CommandProgressSearchRequest {
	id?: number;
	isDelete?: boolean;
	progressId?: number;
	progressCode?: string;
	progressName?: string;
	progressOrder?: number;
	isOutsourcing?: boolean;
	keyManagementContent?: string;
	commandId?: number;
	commandNo?: string;
}

// CommandProgress 생성 요청 타입
export interface CommandProgressCreateRequest {
	progressId: number;
	progressCode?: string;
	progressName?: string;
	progressOrder?: number;
	isOutsourcing?: boolean;
	keyManagementContent?: string;
	commandId: number;
	commandNo?: string;
}

// CommandProgress 수정 요청 타입
export interface CommandProgressUpdateRequest {
	progressId: number;
	progressCode?: string;
	progressName?: string;
	progressOrder?: number;
	isOutsourcing?: boolean;
	keyManagementContent?: string;
	commandId: number;
	commandNo?: string;
}

// CommandProgress 검색 응답 타입
export interface CommandProgressSearchResponse extends CommandProgressDto {}

// 페이지네이션 관련 타입
export interface PageCommandProgressSearchResponse {
	totalPages: number;
	totalElements: number;
	size: number;
	content: CommandProgressSearchResponse[];
	number: number;
	first: boolean;
	last: boolean;
	empty: boolean;
}

// 공통 응답 타입
export interface CommonResponseCommandProgressDto {
	status: string;
	data: CommandProgressDto;
	message: string;
}

export interface CommonResponseListCommandProgressDto {
	status: string;
	data: CommandProgressDto[];
	message: string;
}

export interface CommonResponsePageCommandProgressSearchResponse {
	status: string;
	data: PageCommandProgressSearchResponse;
	message: string;
} 