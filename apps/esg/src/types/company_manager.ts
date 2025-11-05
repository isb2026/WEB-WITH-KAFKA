import { Pageable, Sort } from './common';

export interface GetAllCompanyManagerListPayload {
	page: number;
	size: number;
	searchRequest?: SearchCompanyManagerRequest;
}

export interface GetSearchCompanyManagerListPayload {
	page: number;
	size: number;
	searchRequest: SearchCompanyManagerRequest;
}
interface SearchCompanyManagerRequest {
	isUse?: boolean;
	isDelete?: boolean;
	createdAtStart?: string;
	createdAtEnd?: string;
	createdBy?: string;
	updatedAtStart?: string;
	updatedAtEnd?: string;
	updatedBy?: string;
	id?: number;
	companyId?: number;
	username?: string;
	name?: string;
	position?: string;
	grade?: string;
	phone?: string;
	address?: string;
	addressDetail?: string;
}
export interface CompanyManagerListResponse {
	totalElements: number;
	totalPages: number;
	size: number;
	content: CompanyManager[];
	number: number;
	sort: Sort;
	numberOfElements: number;
	pageable: Pageable;
	first: boolean;
	last: boolean;
	empty: boolean;
}

export interface CompanyManager {
	id: number;
	address?: string;
	addressDetail?: string;
	company: {
		isUse: boolean;
		isDelete: boolean;
		tenantId: number;
		createdAt: string;
		createdBy: string;
	};
	createdAt: string;
	createdBy: string;
	department?: string;
	grade?: string;
	isUse: boolean;
	name: string;
	phone?: string;
	updatedAt: string;
	updatedBy: string;
	username: string;
}
