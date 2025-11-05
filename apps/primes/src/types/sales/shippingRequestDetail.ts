import { Pageable, Sort } from '../common';
import { ShippingRequestMaster } from './shippingRequestMaster';

export interface GetAllShippingRequestDetailListPayload {
	page: number;
	size: number;
}

export interface ShippingRequestDetailListResponse {
	totalElements: number;
	totalPages: number;
	size: number;
	content: ShippingRequestDetail[];
	number: number;
	sort: Sort;
	numberOfElements: number;
	pageable: Pageable;
	first: boolean;
	last: boolean;
	empty: boolean;
}

export interface CreateShippingRequestDetailPayload {
	shippingRequestMasterId: number;
	itemId: number;
	itemNo: number;
	itemNumber: string;
	itemName: string;
	itemSpec: string;
	requestUnit: string;
	requestNumber: number;
	currencyUnit: string;
	unitPrice: number;
	netPrice: number;
	vat?: number;
	grossPrice: number;
	memo?: string;
}

export type CreateShippingRequestDetailPayloadArray =
	CreateShippingRequestDetailPayload[];

export interface ShippingRequestDetail {
	tenantId: number;
	isUse: boolean;
	isDelete: boolean;
	createdAt: string;
	createdBy: string;
	updatedAt: string;
	updatedBy: string;
	id: number;
	shippingRequestMasterId: number;
	itemId: number;
	itemNo: number;
	itemNumber: string;
	itemName: string;
	itemSpec: string;
	requestUnit: string;
	requestNumber: number;
	currencyUnit: string;
	unitPrice: number;
	netPrice: number;
	vat: number;
	grossPrice: number;
	memo: string;
	shippingRequestMaster: ShippingRequestMaster[];
}

export interface UpdateShippingRequestDetailPayload {
	id: number;
	shippingRequestMasterId: number;
	itemId: number;
	itemNo: number;
	itemNumber: string;
	itemName: string;
	itemSpec: string;
	requestUnit: string;
	requestNumber: number;
	currencyUnit: string;
	unitPrice: number;
	netPrice: number;
	vat: number;
	grossPrice: number;
	memo?: string;
}

export interface GetSearchShippingRequestDetailListPayload {
	page: number;
	size: number;
	searchRequest: SearchShippingRequestDetailRequest;
}

export interface SearchShippingRequestDetailRequest {
	createdAtEnd?: string;
	createdAtStart?: string;
	updatedAtEnd?: string;
	updatedBy?: string;
	updatedAtStart?: string;
	isDelete?: boolean;
	id?: number;
	isUse?: boolean;
	createdBy?: string;
}
