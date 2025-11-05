//Purchase쪽 vendors
import { Pageable, Sort } from '../common';

export interface GetAllVendorsListPayload {
	page: number;
	size: number;
}

export interface VendorsListResponse {
	totalElements: number;
	totalPages: number;
	size: number;
	content: Vendors[];
	number: number;
	sort: Sort;
	numberOfElements: number;
	pageable: Pageable;
	first: boolean;
	last: boolean;
	empty: boolean;
}

export interface CreateVendorsPayload {
	isUse: boolean;
	compCode: string;
	compType: string;
	licenseNo: string;
	compName: string;
	ceoName: string;
	compEmail: string;
	telNumber: string;
	faxNumber: string;
	zipCode: string;
	addressDtl: string;
	addressMst: string;
}

export interface Vendors {
	id: number;
	tenantId: number;
	isDelete: boolean;
	isUse: boolean;
	compCode: string;
	compType: string;
	licenseNo: string;
	compName: string;
	ceoName: string;
	compEmail: string;
	telNumber: string;
	faxNumber: string;
	zipCode: string;
	addressDtl: string;
	addressMst: string;
	createBy: string;
	createAt: string;
	updateBy: string;
	updateAt: string;
}

export interface UpdateVendorsPayload {
	isUse: boolean;
	compCode: string;
	compType: string;
	licenseNo: string;
	compName: string;
	ceoName: string;
	compEmail: string;
	telNumber: string;
	faxNumber: string;
	zipCode: string;
	addressDtl: string;
	addressMst: string;
}

export interface GetSearchVendorsListPayload {
	page: number;
	size: number;
	searchRequest: SearchVendorsRequest;
}

export interface SearchVendorsRequest {
	updateBy?: string;
	licenseNo?: string;
	telNumber?: string;
	faxNumber?: string;
	addressDtl?: string;
	compType?: string;
	compEmail?: string;
	zipCode?: string;
	createAt?: string;
	createBy?: string;
	isDelete?: boolean;
	ceoName?: string;
	compName?: string;
	addressMst?: string;
	id?: number;
	compCode?: string;
	updateAt?: string;
	isUse?: boolean;
}