import { Pageable, Sort } from '../common';
import { TaxInvoiceDetail } from './taxInvoiceDetail';

export interface GetAllTaxInvoiceMasterListPayload {
	page: number;
	size: number;
}

export interface GetAllTaxInvoiceMasterListWithDetailPayload {
	page: number;
	size: number;
}

export interface TaxInvoiceMasterListResponse {
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

export interface TaxInvoiceMaster {
	tenantId: number; // 테넌트 ID
	isUse: boolean; // 사용 여부
	isDelete: boolean; // 삭제 여부
	createdAt: string; // 생성일시 (ISO 8601 형식)
	createdBy: string; // 생성자
	updatedAt: string; // 수정일시 (ISO 8601 형식)
	updatedBy: string; // 수정자
	id: number; // 세금계산서 마스터 ID
	taxInvoiceCode?: string; // 세금계산서 코드, 예: TAX-2024-001
	vendorNo: number; // 거래처 번호, 예: 1
	vendorName: string; // 거래처명, 예: 삼성전자
	taxDate: string; // 세금계산서 날짜, 예: 2024-03-20
	taxInvoiceDetails: TaxInvoiceDetail[]; // 세금계산서 상세 목록
}

export interface CreateTaxInvoiceMasterPayload {
	taxInvoiceCode?: string; // 명세서 코드, 예: STMT-2024-001
	vendorNo: number; // 거래처 번호, 예: 1
	vendorName: string; // 거래처명, 예: 삼성전자
	taxDate: string; // 요청일, 예: 2024-03-20
	isUse?: boolean; // 사용 여부, 예: true
}

export interface UpdateTaxInvoiceMasterPayload {
	taxInvoiceCode?: string; // 명세서 코드, 예: STMT-2024-001
	vendorNo: number; // 거래처 번호, 예: 1
	vendorName: string; // 거래처명, 예: 삼성전자
	taxDate: string; // 요청일, 예: 2024-03-20
	isUse?: boolean; // 사용 여부, 예: true
}

export interface GetSearchTaxInvoiceMasterListPayload {
	page: number;
	size: number;
	searchRequest: SearchTaxInvoiceMasterRequest;
}

export interface SearchTaxInvoiceMasterRequest {
	createdAtEnd?: string; // 생성일시 종료 (ISO 8601 형식)
	createdAtStart?: string; // 생성일시 시작 (ISO 8601 형식)
	updatedAtEnd?: string; // 수정일시 종료 (ISO 8601 형식)
	updatedBy?: string; // 수정자, 예: admin
	updatedAtStart?: string; // 수정일시 시작 (ISO 8601 형식)
	isDelete?: boolean; // 삭제 여부, 예: false
	id?: number; // 세금계산서 마스터 ID, 예: 1
	isUse?: boolean; // 사용 여부, 예: true
	createdBy?: string; // 생성자, 예: admin
}
