import { Pageable, Sort } from '../common';

export interface GetAllPurchaseMasterListPayload {
	page: number;
	size: number;
}

export interface PurchaseMasterListResponse {
	totalElements: number;
	totalPages: number;
	size: number;
	content: PurchaseMaster[];
	number: number;
	sort: Sort;
	numberOfElements: number;
	pageable: Pageable;
	first: boolean;
	last: boolean;
	empty: boolean;
}

export interface PurchaseMaster {
	id: number;
	tenantId: number;
	isDelete: boolean;
	purchaseCode: string;
	purchaseType: string;
	itemId?: number;
	number?: number;
	unit?: string;
	unitPrice?: number;
	netPrice: number;
	grossPrice: number;
	vendorId: number;
	vendorName: string;
	purchaseDate: string;
	deliveryLocationId: string;
	deliveryLocation: string;
	requestDate: string;
	currencyUnit: string;
	isApproval: boolean;
	approvalBy: string;
	approvalAt: string;
	isClose: boolean;
	closeBy: string;
	closeAt: string;
	createBy: string;
	createAt: string;
	updateBy: string;
	updateAt: string;
}

export interface CreatePurchaseMasterPayload {
	purchaseCode: string;
	purchaseType: string;
	vendorId: number;
	vendorName: string;
	purchaseDate: string;
	deliveryLocationId: string;
	deliveryLocation: string;
	requestDate: string;
	currencyUnit: string;
	isApproval?: boolean;
	approvalBy?: string;
	approvalAt?: string;
	isClose?: boolean;
	closeBy?: string;
	closeAt?: string;
}

export interface UpdatePurchaseMasterPayload {
	purchaseCode: string;
	purchaseType: string;
	vendorId: number;
	vendorName: string;
	purchaseDate: string;
	deliveryLocationId: string;
	deliveryLocation: string;
	requestDate: string;
	currencyUnit: string;
	isApproval: boolean;
	approvalBy: string;
	approvalAt: string;
	isClose: boolean;
	closeBy: string;
	closeAt: string;
}

export interface GetSearchPurchaseMasterListPayload {
	page: number;
	size: number;
	searchRequest: SearchPurchaseMasterRequest;
}

export interface SearchPurchaseMasterRequest {
	updateBy?: string;
	vendorId?: number;
	deliveryLocation?: string;
	closeAt?: string;
	isApproval?: boolean;
	purchaseCode?: string;
	isClose?: boolean;
	purchaseDate?: string;
	closeBy?: string;
	createAt?: string;
	createBy?: string;
	vendorName?: string;
	currencyUnit?: string;
	isDelete?: boolean;
	deliveryLocationId?: string;
	approvalAt?: string;
	approvalBy?: string;
	id?: number;
	purchaseType?: string;
	updateAt?: string;
	requestDate?: string;
}
