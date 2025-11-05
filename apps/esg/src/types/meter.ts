import { Pageable, Sort } from './common';

export interface GetAllMeterListPayload {
	page: number;
	size: number;
	searchRequest?: SearchMeterRequest;
}

export interface GetSearchMeterListPayload {
	page: number;
	size: number;
	searchRequest: SearchMeterRequest;
}

export interface SearchMeterRequest {
	isUse?: boolean;
	isDelete?: boolean;
	createdAtStart?: string;
	createdAtEnd?: string;
	createdBy?: string;
	updatedAtStart?: string;
	updatedAtEnd?: string;
	updatedBy?: string;
	id?: number;
	name?: string;
	servicePoint?: string;
	component?: string;
	serialNo?: string;
	quantity?: number;
	installedOn?: string;
	installedBy?: string;
	replacedOn?: string;
	replacedBy?: string;
}

export interface Meter {
	id: number;
	tenantId?: number;
	isUse: boolean;
	isDelete?: boolean;
	name: string;
	servicePoint: string;
	component: string;
	serialNo: string;
	quantity: number;
	installedOn: string;
	installedBy: string;
	replacedOn: string;
	replacedBy: string;
	createdAt?: string;
	createdBy?: string;
	updatedAt?: string;
	updatedBy?: string;
}

export interface MeterListResponse {
	content: Meter[];
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
