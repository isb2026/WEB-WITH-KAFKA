import { Pageable, Sort } from '../common';
import { StatementDetail } from './statementDetail';

export interface GetAllStatementMasterListPayload {
	page: number;
	size: number;
}

export interface GetAllStatementMasterListWithDetailPayload {
	page: number;
	size: number;
}

export interface StatementMasterListResponse {
	totalElements: number;
	totalPages: number;
	size: number;
	content: StatementMaster[];
	number: number;
	sort: Sort;
	numberOfElements: number;
	pageable: Pageable;
	first: boolean;
	last: boolean;
	empty: boolean;
}

export interface StatementMaster {
	tenantId: number;
	accountYear: number;
	isUse: boolean;
	isDelete: boolean;
	createdAt: string;
	createdBy: string;
	updatedAt: string;
	updatedBy: string;
	id: number;
	statementCode: string; // 전표 코드
	vendorNo: number; // 공급업체 번호
	vendorName: string; // 공급업체 이름
	requestDate: string; // 요청일
	statementDetails: StatementDetail[]; // 전표 상세 내역
}

export interface CreateStatementMasterPayload {
	statementCode?: string; // 명세서 코드, 예: STMT-2024-001
	vendorNo: number; // 거래처 번호, 예: 1
	vendorName: string; // 거래처명, 예: 삼성전자
	requestDate: string; // 요청일, 예: 2024-03-20
	isUse?: boolean; // 사용 여부, 예: true
}

export interface UpdateStatementMasterPayload {
	statementCode?: string; // 명세서 코드, 예: STMT-2024-001
	vendorNo: number; // 거래처 번호, 예: 1
	vendorName: string; // 거래처명, 예: 삼성전자
	requestDate: string; // 요청일, 예: 2024-03-20
	isUse?: boolean; // 사용 여부, 예: true
}

export interface GetSearchStatementMasterListPayload {
	page: number;
	size: number;
	searchRequest: SearchStatementMasterRequest;
}

export interface SearchStatementMasterRequest {
	createdAtEnd?: string; // 생성일시 종료, 예: 2024-03-20T23:59:59
	createdAtStart?: string; // 생성일시 시작, 예: 2024-03-01T00:00:00
	updatedAtEnd?: string; // 수정일시 종료, 예: 2024-03-20T23:59:59
	updatedAtStart?: string; // 수정일시 시작, 예: 2024-03-01T00:00:00
	updatedBy?: string; // 수정자, 예: admin
	isDelete?: boolean; // 삭제 여부, 예: false
	id?: number; // ID, 예: 1
	isUse?: boolean; // 사용 여부, 예: true
	createdBy?: string; // 생성자, 예: admin
}
