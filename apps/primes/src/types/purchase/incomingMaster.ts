import { Pageable, Sort } from '../common';

export interface GetAllIncomingMasterListPayload {
	page: number;
	size: number;
}

export interface IncomingMasterListResponse {
	totalElements: number;
	totalPages: number;
	size: number;
	content: IncomingMaster[];
	number: number;
	sort: Sort;
	numberOfElements: number;
	pageable: Pageable;
	first: boolean;
	last: boolean;
	empty: boolean;
}

export interface IncomingMaster {
	id: number;
	tenantId: number;
	isDelete: boolean;
	incomingCode: string;
	vendorId: number;
	vendorName: string;
	incomingDate: string;
	currencyUnit: string;
	isApproval: boolean;
	approvalBy: string;
	approvalAt: string;
	isClose: boolean;
	closeBy: string;
	closeAt: string;
	createBy: string;
	createAt: string;
	updateBy: string;
	updateAt: string;
}

export interface CreateIncomingMasterPayload {
	incomingCode: string;
	vendorId: number;
	vendorName: string;
	incomingDate: string;
	currencyUnit: string;
	isApproval: boolean;
	approvalBy: string;
	approvalAt: string;
	isClose: boolean;
	closeBy: string;
	closeAt: string;
}

export interface UpdateIncomingMasterPayload {
	incomingCode: string;
	vendorId: number;
	vendorName: string;
	incomingDate: string;
	currencyUnit: string;
	isApproval: boolean;
	approvalBy: string;
	approvalAt: string;
	isClose: boolean;
	closeBy: string;
	closeAt: string;
}

export interface GetSearchIncomingMasterListPayload {
	page: number;
	size: number;
	searchRequest: SearchIncomingMasterRequest;
}

export interface SearchIncomingMasterRequest {
	updateBy?: string;
	vendorId?: number;
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

export interface MovePaperMaster {
    id: number;
    workOrderNo: string; // 작업지시번호 (필수)
	lotNo: string; // LOT 번호 (필수)
    boxNo: string; // BOX 번호 (필수)
    issueTime: string; // 발행일시 (필수)
	material: string; // 자재코드 (필수)
	dateRecieved?: Date; // 입고일자 (필수)
	quantity?: number; // 입고수량 (필수)
	unit?: string; // 단위 (필수)
	materialSpec?: string; // 자재규격
	color?: string; // 색상
	vendorName?: string; // 공급처
	weight?: number; // 중량
	lotNumber?: string; // LOT 번호
	tenantId?: number;
	isDelete?: boolean;
    startNo?: string; // 시작번호
    issueCount?: number; // 발행수
    totalIssued?: number; // 총발행된 이동표수
    status?: string; // 상태 (Issued, Completed, Canceled)
    createdAt?: string;
    updatedAt?: string;
    createdBy?: string;
    updatedBy?: string;
}
  
