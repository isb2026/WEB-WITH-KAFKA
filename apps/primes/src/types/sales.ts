// Order types (legacy - use types from orderMaster.ts and orderDetail.ts for new code)
export interface OrderMasterPayloadLegacy {
	orderCode?: string;
	vendorNo?: number;
	vendorName?: string;
	requestDate?: string;
	orderDate?: string;
	currencyUnit?: string;
	isUse?: boolean;
}

export interface OrderDetailItemLegacy {
	orderMasterId: number;
	itemId: number;
	itemNo: number;
	itemNumber: string;
	itemName: string;
	orderUnit: string;
	orderNumber: number;
	currencyUnit: string;
	unitPrice: number;
	netPrice: number;
	vat: number;
	grossPrice: number;
	requestDate: string;
	isUse?: boolean;
}

export interface OrderDetailPayloadLegacy {
	dataList: OrderDetailItemLegacy[];
}

export interface OrderMasterLegacy {
	id: number;
	orderCode: string;
	vendorNo: number;
	vendorName: string;
	requestDate: string;
	isUse: boolean | null;
	isDelete: boolean;
	createdAt: string;
	createdBy: string;
	updatedAt: string;
	updatedBy: string;
	tenantId: number;
	accountYear: number | null;
	orderDetails: OrderDetailLegacy[] | null;
}

export interface OrderDetailLegacy {
	id: number;
	itemNumber: string;
	requestDate: string;
	itemName: string;
	orderNumber: number;
	unitPrice: number;
	grossPrice: number;
	isProdCmd: boolean;
}

import { Pageable, Sort } from './common';

// Export new delivery types from separate files
export * from './sales/deliveryMaster';
export * from './sales/deliveryDetail';

// Export new order types from separate files
export * from './sales/orderMaster';
export * from './sales/orderDetail';

// Delivery Master types
export interface DeliveryMaster {
	id: number;
	deliveryCode: string;
	vendorNo: number;
	vendorName: string;
	deliveryDate: string;
	deliveryLocationCode?: number;
	deliveryLocation?: string;
	currencyUnit?: string;
	isApproval: boolean;
	approvalBy?: string;
	approvalAt?: string;
	isClose: boolean;
	closeBy?: string;
	closeAt?: string;
	createdAt: string;
	createdBy: string;
	updatedAt: string;
	updatedBy: string;
	tenantId: number;
	accountYear: number | null;
	isUse: boolean | null;
	isDelete: boolean;
	deliveryDetails: unknown[] | null;
}

// Delivery Detail types (legacy - use types from deliveryDetail.ts for new code)
export interface DeliveryDetailLegacy {
	id: number;
	itemNumber: string;
	requestDate: string;
	itemName: string;
	deliveryNumber: number;
	unitPrice: number;
	grossPrice: number;
	isDelivered: boolean;
}

// API response types
export interface DeliveryListResponse {
	totalElements: number;
	totalPages: number;
	size: number;
	content: DeliveryMaster[];
	number: number;
	sort: Sort;
	numberOfElements: number;
	pageable: Pageable;
	first: boolean;
	last: boolean;
	empty: boolean;
}

export interface DeliveryDetailListResponse {
	totalElements: number;
	totalPages: number;
	size: number;
	content: DeliveryDetailLegacy[];
	number: number;
	sort: Sort;
	numberOfElements: number;
	pageable: Pageable;
	first: boolean;
	last: boolean;
	empty: boolean;
}

// Create/Update payload types
export interface DeliveryMasterPayload {
	vendorNo: number;
	vendorName: string;
	deliveryDate: string;
	deliveryLocationCode?: number;
	deliveryLocation?: string;
	currencyUnit?: string;
	isApproval?: boolean;
	approvalBy?: string;
	approvalAt?: string;
	isClose?: boolean;
	closeBy?: string;
	closeAt?: string;
}

export interface DeliveryDetailItem {
	deliveryMasterId: number;
	itemId: number;
	itemNo: number;
	itemNumber: string;
	itemName: string;
	itemSpec: string;
	deliveryUnit: string;
	deliveryAmount: number;
	currencyUnit: string;
	unitPrice: number;
	netPrice: number;
	grossPrice: number;
	memo: string;
	vat: number;
}

export interface DeliveryDetailPayload {
	dataList: DeliveryDetailItem[];
}

// TaxInvoice Master types
export interface TaxInvoiceMaster {
	id: number;
	tenantId: number;
	isDelete: boolean;
	taxInvoiceCode: string;
	vendorNo: number;
	vendorName: string;
	taxDate: string;
	createdBy: string;
	createdAt: string;
	updatedBy: string;
	updatedAt: string;
	taxInvoiceDetails: TaxInvoiceDetail[] | null;
}

// TaxInvoice Detail types
export interface TaxInvoiceDetail {
	id: number;
	tenantId: number;
	isDelete: boolean;
	taxInvoiceMasterId: number;
	taxInvoiceMaster: TaxInvoiceMaster;
	itemId: number;
	itemNo: number;
	itemNumber: string;
	itemName: string;
	itemSpec: string;
	taxUnit: string;
	taxNumber: number;
	currencyUnit: string;
	unitPrice: number;
	netPrice: number;
	grossPrice: number;
	memo: string;
	createdBy: string;
	createdAt: string;
	updatedBy: string;
	updatedAt: string;
	vat: number;
}

// TaxInvoice API response types
export interface TaxInvoiceListResponse {
	totalElements: number;
	totalPages: number;
	size: number;
	content: TaxInvoiceMaster[];
	number: number;
	sort: Sort;
	numberOfElements: number;
	pageable: Pageable;
	first: boolean;
	last: boolean;
	empty: boolean;
}

export interface TaxInvoiceDetailListResponse {
	totalElements: number;
	totalPages: number;
	size: number;
	content: TaxInvoiceDetail[];
	number: number;
	sort: Sort;
	numberOfElements: number;
	pageable: Pageable;
	first: boolean;
	last: boolean;
	empty: boolean;
}

// TaxInvoice Create/Update payload types
export interface TaxInvoiceMasterPayload {
	taxInvoiceCode: string;
	vendorNo: number;
	vendorName: string;
	taxDate: string;
}

export interface TaxInvoiceDetailPayload {
	taxInvoiceMasterId: number;
	itemId: number;
	itemNo: number;
	itemNumber: string;
	itemName: string;
	itemSpec: string;
	taxUnit: string;
	taxNumber: number;
	currencyUnit: string;
	unitPrice: number;
	netPrice: number;
	grossPrice: number;
	memo: string;
	vat: number;
}

export interface TaxInvoiceDetailListPayload {
	taxInvoiceMasterId: number;
	itemId: number;
	itemNo: number;
	itemNumber: string;
	itemName: string;
	itemSpec: string;
	taxUnit: string;
	taxNumber: number;
	currencyUnit: string;
	unitPrice: number;
	netPrice: number;
	grossPrice: number;
	memo: string;
	vat: number;
}

// TaxInvoice Search Request types
export interface TaxInvoiceMasterSearchRequest {
	createdAtStart?: string;
	createdAtEnd?: string;
	createdBy?: string;
	updatedAtStart?: string;
	updatedAtEnd?: string;
	updatedBy?: string;
	id?: number;
	taxInvoiceCode?: string;
	vendorNo?: number;
	vendorName?: string;
	taxDate?: string;
}

export interface TaxInvoiceDetailSearchRequest {
	createdAtStart?: string;
	createdAtEnd?: string;
	createdBy?: string;
	updatedAtStart?: string;
	updatedAtEnd?: string;
	updatedBy?: string;
	id?: number;
	taxInvoiceMasterId?: number;
	itemId?: number;
	itemNo?: number;
	itemNumber?: string;
	itemName?: string;
	itemSpec?: string;
	taxUnit?: string;
	taxNumber?: number;
	currencyUnit?: string;
	unitPrice?: number;
	netPrice?: number;
	grossPrice?: number;
	memo?: string;
	vat?: number;
}
