import { Pageable, Sort } from './common';

export interface SearchAccountStyleRequest {
	isUse?: boolean;
	isDelete?: boolean;
	createdAtStart?: string;
	updatedAtEnd?: string;
	categoryInScope?: number;
	updatedBy?: string;
	updatedAtStart?: string;
	id?: number;
	createdBy?: string;
	caption?: string;
	dataType?: number;
}
export interface GetAllAccountStyleListPayload {
	page: number;
	size: number;
	searchRequest?: SearchAccountStyleRequest;

}

export interface GetSearchAccountStyleListPayload {
	page: number;
	size: number;
	searchRequest?: SearchAccountStyleRequest;
}

export interface GetFieldDataPayload {
	dataTypeId?: number;
	isUse?: boolean;
	isDelete?: boolean;
	categoryInScope?: number;
}

export interface AccountStyle {
	id: number;
	isUse: boolean;
	isDelete: boolean;
	tenantId: number;
	createdAt: string;
	createdBy: string;
	updatedAt: string;
	updatedBy: string;
	dataType: number;
	caption: string;
	categoryInScope: number;
}

export interface AccountStyleListResponse {
	content: AccountStyle[];
	pageable: Pageable;
	sort: Sort;
	totalElements: number;
	totalPages: number;
	last: boolean;
	size: number;
	number: number;
	numberOfElements: number;
	first: boolean;
	empty: boolean;
}

export interface CreateAccountStylePayload {
	dataType: number;
	caption: string;
	categoryInScope: number;
}

export interface UpdateAccountStylePayload {
	id: number;
	dataType?: number;
	caption?: string;
	categoryInScope?: number;
	isUse?: boolean;
}
