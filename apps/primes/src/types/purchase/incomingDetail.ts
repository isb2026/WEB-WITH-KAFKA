import { Pageable, Sort } from '../common';

export interface GetAllIncomingDetailListPayload {
	page: number;
	size: number;
}

export interface IncomingDetailListResponse {
	totalElements: number;
	totalPages: number;
	size: number;
	content: IncomingDetail[];
	number: number;
	sort: Sort;
	numberOfElements: number;
	pageable: Pageable;
	first: boolean;
	last: boolean;
	empty: boolean;
}

export interface IncomingDetail {
	id: number;
	tenantId: number;
	isDelete: boolean;
	incomingId: number;
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
	memo: string;
	createBy: string;
	createAt: string;
	updateBy: string;
	updateAt: string;
	vat: number;
}

export interface CreateIncomingDetailPayload {
	dataList: {
		incomingMasterId: number;
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
		memo: string;
		vat: number;
	}[];
}

export interface UpdateIncomingDetailPayload {
	incomingId: number;
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
	memo: string;
	vat: number;
}

export interface GetSearchIncomingDetailListPayload {
	page: number;
	size: number;
	searchRequest: SearchIncomingDetailRequest;
}

export interface SearchIncomingDetailRequest {
	updateBy?: string;
	incomingId?: number;
	unit?: string;
	grossPrice?: number;
	unitPrice?: number;
	vat?: number;
	number?: number;
	netPrice?: number;
	itemSpec?: string;
	createAt?: string;
	createBy?: string;
	itemNo?: number;
	currencyUnit?: string;
	memo?: string;
	id?: number;
	itemNumber?: string;
	updateAt?: string;
	itemName?: string;
}
  

