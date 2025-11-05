import { Pageable, Sort } from '../common';
import { PurchaseMaster } from './purchaseMaster';

export interface GetAllPurchaseDetailListPayload {
	page: number;
	size: number;
}

export interface PurchaseDetailListResponse {
	totalElements: number;
	totalPages: number;
	size: number;
	content: PurchaseDetail[];
	number: number;
	sort: Sort;
	numberOfElements: number;
	pageable: Pageable;
	first: boolean;
	last: boolean;
	empty: boolean;
}

export interface PurchaseDetail {
	id: number;
	tenantId: number;
	isDelete: boolean;
	purchaseId: number;
	itemId: number;
	itemNo: number;
	itemNumber?: string;
	itemName?: string;
	itemSpec?: string;
	unit: string;
	number: number;
	currencyUnit: string;
	unitPrice: number;
	netPrice: number;
	grossPrice: number;
	requestDate: string;
	createBy: string;
	createAt: string;
	updateBy: string;
	updateAt: string;
	vat: number;
}

export interface CreatePurchaseDetailPayload {
	purchaseMasterId: number;
	itemId: number;
	itemNo: number;
	itemNumber: string;
	itemName: string;
	itemSpec: string;
	unit: string;
	number: number;
	currencyUnit: string;
	unitPrice: number;
	netPrice: number;
	grossPrice: number;
	requestDate: string;
	vat: number;
}

export interface UpdatePurchaseDetailPayload {
	purchaseMasterId: number;
	itemId: number;
	itemNo: number;
	itemNumber: string;
	itemName: string;
	itemSpec: string;
	unit: string;
	number: number;
	currencyUnit: string;
	unitPrice: number;
	netPrice: number;
	grossPrice: number;
	requestDate: string;
	vat: number;
}

export interface GetSearchPurchaseDetailListPayload {
	page: number;
	size: number;
	searchRequest: SearchPurchaseDetailRequest;
}

export interface SearchPurchaseDetailRequest {
	updateBy?: string;
	vendorNo?: number;
	closeAt?: string;
	isApproval?: boolean;
	isClose?: boolean;
	closeBy?: string;
	createAt?: string;
	createBy?: string;
	incomingCode?: string;
	vendorName?: string;
	incomingDate?: string;
	currencyUnit?: string;
	isDelete?: boolean;
	approvalAt?: string;
	approvalBy?: string;
	id?: number;
	updateAt?: string;
}