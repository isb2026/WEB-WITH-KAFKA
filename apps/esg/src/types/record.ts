import { Pageable, Sort } from './common';

export interface GetAllRecordListPayload {
	page: number;
	size: number;
	searchRequest?: SearchRecordRequest;
}

export interface GetSearchRecordListPayload {
	page: number;
	size: number;
	searchRequest: SearchRecordRequest;
}

export interface SearchRecordRequest {
	id?: number;
	name?: string;
	isUse?: boolean;
	isDelete?: boolean;
	createdAtStart?: string;
	createdAtEnd?: string;
	createdBy?: string;
	updatedAtStart?: string;
	updatedAtEnd?: string;
	updatedBy?: string;
	accountId?: number | null;
	startPeriod?: string;
	endPeriod?: string;
	quantity?: number;
	totalCost?: number;
	reference?: string;
	invoiceOn?: string;
	invoiceMemo?: string;
	amountToPay?: number;
	payableOn?: string;
	paidOn?: string;
	companyId?: number | null;
}

export interface Record {
	id: number;
	tenantId?: number;
	isUse: boolean;
	isDelete?: boolean;
	name: string;
	createdAt?: string;
	createdBy?: string;
	updatedAt?: string;
	updatedBy?: string;
	// 실제 Record 데이터 필드들
	accountId?: number;
	accountName?: string;
	accountStyleName?: string;
	accountStyleCaption?: string;
	accountMonth?: string;
	quantity?: number;
	unit?: string;
	totalCost?: number;
	reference?: string;
	invoiceOn?: string;
	invoiceMemo?: string;
	amountToPay?: number;
	payableOn?: string;
	paidOn?: string;
	// 월별 데이터 (월별 입력용)
	jan?: number;
	feb?: number;
	mar?: number;
	apr?: number;
	may?: number;
	jun?: number;
	jul?: number;
	aug?: number;
	sep?: number;
	oct?: number;
	nov?: number;
	dec?: number;
	total?: number;
}

export interface RecordListResponse {
	content: Record[];
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
export interface CreateRecordPayload {
	accountId?: number; // Account id
	accountMonth?: string; // Account month (YYYYMM)
	quantity?: number; // Quantity
	totalCost?: number; // Total cost
	reference?: string; // Reference
	invoiceOn?: string; // Invoice on (YYYY-MM-DD)
	invoiceMemo?: string; // Invoice memo
	amountToPay?: number; // Amount to pay
	payableOn?: string; // Payable on (YYYY-MM-DD)
	paidOn?: string; // Paid on (YYYY-MM-DD)
}

export interface UpdateRecordPayload {
	startPeriod?: string; // Start period (YYYY-MM-DD)
	endPeriod?: string; // End period (YYYY-MM-DD)
	quantity?: number; // Quantity
	totalCost?: number; // Total cost
	reference?: string; // Reference
	invoiceOn?: string; // Invoice on (YYYY-MM-DD)
	invoiceMemo?: string; // Invoice memo
	amountToPay?: number; // Amount to pay
	payableOn?: string; // Payable on (YYYY-MM-DD)
	paidOn?: string;
	isUse?: boolean;
}
