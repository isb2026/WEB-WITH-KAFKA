import { Pageable, Sort } from './common';

export interface GetAllCompanyTypeListPayload {
	page: number;
	size: number;
}

export interface GetSearchCompanyTypeListPayload {
	page: number;
	size: number;
	searchRequest: SearchCompanyTypeRequest;
}

interface SearchCompanyTypeRequest {}

export interface CompanyTypeListResponse {
	totalElements: number;
	totalPages: number;
	size: number;
	content: CompanyType[];
	number: number;
	sort: Sort;
	numberOfElements: number;
	pageable: Pageable;
	first: boolean;
	last: boolean;
	empty: boolean;
}

export interface CompanyType {
	id: number;
	company_type_code:
		| '본사'
		| '지사'
		| '공장'
		| '관계사'
		| '파트너사'
		| '사업부';
}

export interface CompanyCategoryGroup {
	id: number;
}

export interface createCompanyTypePayload {}
