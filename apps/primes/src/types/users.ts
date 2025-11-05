import { Pageable, Sort } from './common';
// 새로운 검색 요청 타입 (Swagger API 스펙 기반)
export interface UserSearchRequest {
	id?: number;
	isUse?: boolean;
	isDelete?: boolean;
	username?: string;
	name?: string;
	email?: string;
	mobileTel?: string;
	homeTel?: string;
	department?: string;
	partLevel?: string;
	partPosition?: string;
	zipcode?: string;
	addressMst?: string;
	addressDtl?: string;
	inDate?: string;
	outDate?: string;
	isTenantAdmin?: string;
	accountYear?: number;
}
export interface GetAllUserListPayload {
	page: number;
	size: number;
	searchRequest?: UserSearchRequest;
}

export interface UserSearchPayload {
	searchRequest: UserSearchRequest;
	page?: number;
	size?: number;
}

export interface UserListResponse {
	totalElements: number;
	totalPages: number;
	size: number;
	content: User[];
	number: number;
	sort: Sort;
	numberOfElements: number;
	pageable: Pageable;
	first: boolean;
	last: boolean;
	empty: boolean;
}

export interface User {
	tenantId: number;
	accountYear?: number;
	useState?: boolean;
	deleteState?: boolean;
	createdAt?: string;
	createdBy?: string;
	updatedAt?: string;
	updatedBy?: string;
	id?: number;
	email?: string;
	username?: string;
	password?: string;
	name?: string;
	mobileTel?: string;
	homeTel?: string;
	profileImage?: string;
	department?: string;
	partLevel?: string;
	partPosition?: string;
	zipcode?: string;
	addressMaster?: string;
	addressDetail?: string;
	inDate?: string;
	outDate?: string;
	isTenantAdmin?: string;
}
