// FileLink Types based on Swagger API

// FileLinkDto - 파일 링크 응답 데이터
export interface FileLinkDto {
	id: number;
	tenantId: number;
	isDelete: boolean;
	isUse: boolean;
	ownerTable: string;
	ownerType: FileOwnerType;
	ownerTypeDescription: string;
	ownerId: number;
	url: string;
	sortOrder: number;
	isPrimary: boolean;
	description: string;
	createdBy: string;
	createdAt: string; // ISO date string
	updatedBy: string;
	updatedAt: string; // ISO date string
}

// FileOwnerType - 파일 소유자 타입 (Swagger enum 기반)
export type FileOwnerType = 
	| 'ITEM_IMG'
	| 'ITEM_DESIGN'
	| 'ITEM_PROGRESS_DESIGN'
	| 'MACHINE_IMG'
	| 'MACHINE_INSPECTION_IMG';

// FileLinkCreateRequest - FileLink Create 요청
export interface FileLinkCreateRequest {
	ownerTable?: string;
	ownerType?: FileOwnerType;
	ownerTypeDescription?: string;
	ownerId?: number;
	url?: string;
	sortOrder?: number;
	isPrimary?: boolean;
	description?: string;
}

// FileLinkUpdateRequest - FileLink Update 요청
export interface FileLinkUpdateRequest {
	isUse?: boolean;
	ownerTable?: string;
	ownerType?: FileOwnerType;
	ownerTypeDescription?: string;
	ownerId?: number;
	url?: string;
	sortOrder?: number;
	isPrimary?: boolean;
	description?: string;
}

// FileLinkSearchRequest - FileLink 검색 요청
export interface FileLinkSearchRequest {
	isUse?: boolean;
	createdAtStart?: string;
	createdAtEnd?: string;
	createdBy?: string;
	updatedAtStart?: string;
	updatedAtEnd?: string;
	updatedBy?: string;
	id?: number;
	ownerTable?: string;
	ownerType?: FileOwnerType;
	ownerId?: number;
}

// FileLinkUpdateInfo - Java FileLinkUpdateInfo에 대응하는 타입
export interface FileLinkUpdateInfo {
	id?: number;
	url: string;
	ownerType: FileOwnerType;
	sortOrder?: number;
	isPrimary?: boolean;
	description?: string;
}

// Legacy types for backward compatibility
export interface FileUrl extends FileLinkDto {}
export interface CreateFileUrlPayload extends FileLinkCreateRequest {}
export interface UpdateFileUrlPayload extends FileLinkUpdateRequest {} 