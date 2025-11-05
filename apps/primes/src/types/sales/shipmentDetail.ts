import { Pageable, Sort } from '../common';
import { ShipmentMaster } from './shipmentMaster';

export interface GetAllShipmentDetailListPayload {
	page: number;
	size: number;
}

export interface ShipmentDetailListResponse {
	totalElements: number;
	totalPages: number;
	size: number;
	content: ShipmentDetail[];
	number: number;
	sort: Sort;
	numberOfElements: number;
	pageable: Pageable;
	first: boolean;
	last: boolean;
	empty: boolean;
}

export interface ShipmentDetail {
	tenantId: number;
	isUse: boolean;
	isDelete: boolean;
	createdAt: string;
	createdBy: string;
	updatedAt: string;
	updatedBy: string;
	id: number;
	shipmentMasterId: number;
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
	shipmentMaster: ShipmentMaster[];
}

export interface CreateShipmentDetailPayload {
	shipmentMasterId: number;
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

export interface UpdateShipmentDetailPayload {
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
	isUse: boolean;
}

export interface GetSearchShipmentDetailListPayload {
	page: number;
	size: number;
	searchRequest: SearchShipmentDetailRequest;
}

export interface SearchShipmentDetailRequest {
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