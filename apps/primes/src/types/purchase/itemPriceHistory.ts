import { Pageable, Sort } from '../common';

export interface GetAllItemPriceHistoryListPayload {
	page: number;
	size: number;
}

export interface ItemPriceHistoryListResponse {
	totalElements: number;
	totalPages: number;
	size: number;
	content: ItemPriceHistory[];
	number: number;
	sort: Sort;
	numberOfElements: number;
	pageable: Pageable;
	first: boolean;
	last: boolean;
	empty: boolean;
}

export interface CreateItemPriceHistoryPayload {
	itemId: number;
	itemNo: number;
	vendorNo: number;
	applyDate: string;
	beforePrice: number;
	afterPrice: number;
	reasonDesc: string;
}

export interface ItemPriceHistory {
	id: number;
	tenantId: number;
	isDelete: boolean;
	itemId: number;
	itemNo: number;
	vendorNo: number;
	applyDate: string;
	beforePrice: number;
	afterPrice: number;
	reasonDesc: string;
	createBy: string;
	createAt: string;
	updateBy: string;
	updateAt: string;
}

export interface UpdateItemPriceHistoryPayload {
	itemId: number;
	itemNo: number;
	vendorNo: number;
	applyDate: string;
	beforePrice: number;
	afterPrice: number;
	reasonDesc: string;
}

export interface GetSearchItemPriceHistoryListPayload {
	page: number;
	size: number;
	searchRequest: SearchItemPriceHistoryRequest;
}

export interface SearchItemPriceHistoryRequest {
	isDelete?: boolean;
	itemId?: number;
	itemNo?: number;
	vendorNo?: number;
	applyDate?: string;
	beforePrice?: number;
	afterPrice?: number;
	reasonDesc?: string;
}