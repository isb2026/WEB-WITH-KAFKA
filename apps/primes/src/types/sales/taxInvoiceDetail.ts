import { Pageable, Sort } from '../common';
import { TaxInvoiceMaster } from './taxInvoiceMaster';

export interface GetAllTaxInvoiceDetailListPayload {
	page: number;
	size: number;
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

export interface CreateTaxInvoiceDetailPayload {
	taxInvoiceMasterId: number; // 세금계산서 마스터 ID, 예: 1
	itemId: number;             // 품목 ID, 예: 1
	itemNo: number;             // 품목 번호, 예: 1001
	itemNumber: string;         // 품목 코드, 예: ITEM-A001
	itemName: string;           // 품목명, 예: 스마트폰
	itemSpec: string;           // 품목 규격, 예: 128GB, 블랙
	taxUnit: string;            // 세금계산서 단위, 예: EA
	taxNumber: number;          // 세금계산서 수량, 예: 10
	currencyUnit: string;       // 통화 단위, 예: KRW
	unitPrice: number;          // 단가, 예: 1000000
	netPrice: number;           // 공급가액, 예: 10000000
	vat: number;                // 부가세, 예: 1000000
	grossPrice: number;         // 합계금액, 예: 11000000
	memo?: string;              // 메모 (선택), 예: 긴급 발행 요청
}

export interface TaxInvoiceDetail {
	tenantId: number;
	isUse: boolean;
	isDelete: boolean;
	createdAt: string;
	createdBy: string;
	updatedAt: string;
	updatedBy: string;
	id: number;
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
	vat: number;
	grossPrice: number;
	memo: string;
	taxInvoiceMaster: TaxInvoiceMaster[];
}

export interface UpdateTaxInvoiceDetailPayload {
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
	vat: number;          
	grossPrice: number;   
	memo?: string;        
	isUse: boolean;       
}

export interface GetSearchTaxInvoiceDetailListPayload {
	page: number;
	size: number;
	searchRequest: SearchTaxInvoiceDetailRequest;
}

export interface SearchTaxInvoiceDetailRequest {
	createdAtEnd?: string;   // 생성일시 종료 (ISO 8601 형식)
	createdAtStart?: string; // 생성일시 시작 (ISO 8601 형식)
	updatedAtEnd?: string;   // 수정일시 종료 (ISO 8601 형식)
	updatedBy?: string;      // 수정자, 예: admin
	updatedAtStart?: string; // 수정일시 시작 (ISO 8601 형식)
	isDelete?: boolean;      // 삭제 여부, 예: false
	id?: number;             // ID, 예: 1
	isUse?: boolean;         // 사용 여부, 예: true
	createdBy?: string;      // 생성자, 예: admin
}