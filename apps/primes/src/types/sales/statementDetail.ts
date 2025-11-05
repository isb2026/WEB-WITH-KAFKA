import { Pageable, Sort } from '../common';
import { StatementMaster } from './statementMaster';

export interface GetAllStatementDetailListPayload {
	page: number;
	size: number;
}

export interface StatementDetailListResponse {
	totalElements: number;
	totalPages: number;
	size: number;
	content: StatementDetail[];
	number: number;
	sort: Sort;
	numberOfElements: number;
	pageable: Pageable;
	first: boolean;
	last: boolean;
	empty: boolean;
}

export interface CreateStatementDetailPayload {
	addressDtl: string;
	addressMst: string;
	ceoName: string;
	compCode: string;
	compEmail: string;
	compName: string;
	compType: string;
	zipCode: string;
	faxNumber: string;
	licenseNo: string;
	telNumber: string;
}

export interface StatementDetail {
	tenantId: number;
	isUse: boolean;
	isDelete: boolean;
	createdAt: string;
	createdBy: string;
	updatedAt: string;
	updatedBy: string;
	id: number;
	statementMasterId: number;
	itemId: number;
	itemNo: number;
	itemNumber: string;
	itemName: string;
	itemSpec: string;
	statementUnit: string;
	statementNumber: number;
	currencyUnit: string;
	unitPrice: number;
	netPrice: number;
	vat: number;
	grossPrice: number;
	memo: string;
	statementMaster?: StatementMaster[];
}

export interface UpdateStatementDetailPayload {
	itemId: number;            // 품목 ID, 예: 1
	itemNo: number;            // 품목 번호, 예: 1001
	itemNumber: string;        // 품목 코드, 예: ITEM-A001
	itemName: string;          // 품목명, 예: 스마트폰
	itemSpec: string;          // 품목 규격, 예: 128GB, 블랙
	statementUnit: string;     // 명세서 단위, 예: EA
	statementNumber: number;   // 명세서 수량, 예: 10
	currencyUnit: string;      // 통화 단위, 예: KRW
	unitPrice: number;         // 단가, 예: 1000000
	netPrice: number;          // 공급가액, 예: 10000000
	vat: number;               // 부가세, 예: 1000000
	grossPrice: number;        // 합계금액, 예: 11000000
	memo: string;              // 메모, 예: 긴급 발행 요청
	isUse: boolean;            // 사용 여부, 예: true
}

export interface GetSearchStatementDetailListPayload {
	page: number;
	size: number;
	searchRequest: SearchStatementDetailRequest;
}

export interface SearchStatementDetailRequest {
	createdAtEnd?: string;    // 생성일시 종료, 예: 2024-03-20T23:59:59
	createdAtStart?: string;  // 생성일시 시작, 예: 2024-03-01T00:00:00
	updatedAtEnd?: string;    // 수정일시 종료, 예: 2024-03-20T23:59:59
	updatedAtStart?: string;  // 수정일시 시작, 예: 2024-03-01T00:00:00
	updatedBy?: string;       // 수정자, 예: admin
	isDelete?: boolean;       // 삭제 여부, 예: false
	id?: number;              // ID, 예: 1
	isUse?: boolean;          // 사용 여부, 예: true
	createdBy?: string;       // 생성자, 예: admin
}