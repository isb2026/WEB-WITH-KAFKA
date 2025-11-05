import { Pageable, Sort } from '../common';

export interface GetAllItemsVendorListPayload {
	page: number;
	size: number;
}

export interface ItemsVendorListResponse {
	totalElements: number;
	totalPages: number;
	size: number;
	content: ItemsVendor[];
	number: number;
	sort: Sort;
	numberOfElements: number;
	pageable: Pageable;
	first: boolean;
	last: boolean;
	empty: boolean;
}

export interface CreateItemsVendorPayload {
	itemId: number;
	itemNo: number;
	vendorId: number;
	vendorName: string;
	vendorItemName: string;
	vendorItemNumber: string;
	price: number;
	isDefault: boolean;
	boxType: string;
	boxLabel: string;
	boxSize: number;
	memo: string;
	sboxSize: number;
	sboxCount: number;
}

export interface ItemsVendor {
	id: number;
	tenantId: number;
	isDelete: boolean;
	vendorId: number;
	vendorName: string;
	itemId: number;
	itemNo: number;
	vendorItemName: string;
	vendorItemNumber: string;
	price: number;
	isDefault: boolean;
	boxType: string;
	boxLabel: string;
	boxSize: number;
	memo: string;
	createdBy: string;
	createdAt: string;
	updatedBy: string;
	updatedAt: string;
	sboxSize: number;
	sboxCount: number;
}

export interface UpdateItemsVendorPayload {
	vendorId: number;
	vendorName: string;
	itemId: number;
	itemNo: number;
	vendorItemName: string;
	vendorItemNumber: string;
	price: number;
	isDefault: boolean;
	boxType: string;
	boxLabel: string;
	boxSize: number;
	memo: string;
	sboxSize: number;
	sboxCount: number;
}

export interface GetSearchItemsVendorListPayload {
	page: number;
	size: number;
	searchRequest: SearchItemsVendorRequest;
}

export interface SearchItemsVendorRequest {
	id?: number;
	isDelete?: boolean;
	vendorId?: number;
	vendorName?: string;
	itemId?: number;
	itemNo?: number;
	vendorItemName?: string;
	vendorItemNumber?: string;
	price?: number;
	isDefault?: boolean;
	boxType?: string;
	boxLabel?: string;
	boxSize?: number;
	sboxSize?: number;
	sboxCount?: number;
	memo?: string;
	createBy?: string;
	createAt?: string;
	updateBy?: string;
	updateAt?: string;
}

export interface ItemsVendorFieldSearchRequest {
	id?: number;
	isDelete?: boolean;
	vendorId?: number;
	vendorName?: string;
	itemId?: number;
	itemNo?: number;
	vendorItemName?: string;
	vendorItemNumber?: string;
	price?: number;
	isDefault?: boolean;
	boxType?: string;
	boxLabel?: string;
	boxSize?: number;
	sboxSize?: number;
	sboxCount?: number;
	memo?: string;
	createBy?: string;
	createdAtStart?: string;
	createdAtEnd?: string;
	updateBy?: string;
	updatedAtStart?: string;
	updatedAtEnd?: string;
}
