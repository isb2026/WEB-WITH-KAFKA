import { Pageable, Sort } from '../common';

export interface GetAllOrderMasterListPayload {
	page: number;
	size: number;
}

export interface GetAllOrderMasterListWithDetailPayload {
	page: number;
	size: number;
}

export interface OrderMasterListResponse {
	totalElements: number;
	totalPages: number;
	size: number;
	content: OrderMaster[];
	number: number;
	sort: Sort;
	numberOfElements: number;
	pageable: Pageable;
	first: boolean;
	last: boolean;
	empty: boolean;
}

export interface OrderMaster {
	tenantId: number; // 테넌트 ID
	isUse: boolean; // 사용 여부
	isDelete: boolean; // 삭제 여부
	createdAt: string; // 생성일시 (ISO 8601 형식)
	createdBy: string; // 생성자
	updatedAt: string; // 수정일시 (ISO 8601 형식)
	updatedBy: string; // 수정자
	id: number; // 주문 마스터 ID
	orderCode: string; // 주문코드, 예: YYMMDD-000#
	orderType: string; // 주문구분
	vendorNo: number; // 업체번호
	vendorName: string; // 업체명
	orderDate: string; // 주문일자
	deliveryLocationCode: number; // 납품처코드
	deliveryLocation: string; // 납품처명
	requestDate: string; // 납기일자
	currencyUnit: string; // 통화단위
	isApproval: boolean; // 승인여부
	approvalBy: string; // 승인자명
	approvalAt: string; // 승인일시 (ISO 8601 형식)
	isClose: boolean; // 마감여부
	closeBy: string; // 마감자명
	closeAt: string; // 마감일시 (ISO 8601 형식)
	orderDetails: any[]; // 주문 상세 목록
}

export interface CreateOrderMasterPayload {
	orderCode?: string; // 주문코드, 예: YYMMDD-000#
	orderType?: string; // 주문구분
	vendorNo: number; // 업체번호
	vendorName: string; // 업체명
	orderDate: string; // 주문일자
	deliveryLocationCode?: number; // 납품처코드
	deliveryLocation?: string; // 납품처명
	requestDate?: string; // 납기일자
	currencyUnit?: string; // 통화단위
	isUse?: boolean; // 사용 여부, 예: true (기본값: true)
}

export interface UpdateOrderMasterPayload {
	orderType?: string;
	vendorNo: number;
	vendorName: string;
	orderDate: string;
	deliveryLocationCode?: number;
	deliveryLocation?: string;
	requestDate?: string;
	currencyUnit?: string;
	isApproval?: boolean;
	approvalBy?: string;
	approvalAt?: string;
	isClose?: boolean;
	closeBy?: string;
	closeAt?: string;
	isUse: boolean;
}

export interface GetSearchOrderMasterListPayload {
	page: number;
	size: number;
	searchRequest: SearchOrderMasterRequest;
}

export interface SearchOrderMasterRequest {
	createdAtEnd?: string; // 생성일시 종료 (ISO 8601 형식)
	createdAtStart?: string; // 생성일시 시작 (ISO 8601 형식)
	updatedAtEnd?: string; // 수정일시 종료 (ISO 8601 형식)
	updatedBy?: string; // 수정자, 예: admin
	updatedAtStart?: string; // 수정일시 시작 (ISO 8601 형식)
	isDelete?: boolean; // 삭제 여부, 예: false
	id?: number; // 주문 마스터 ID, 예: 1
	isUse?: boolean; // 사용 여부, 예: true
	createdBy?: string; // 생성자, 예: admin
	orderCode?: string; // 주문코드
	orderType?: string; // 주문구분
	vendorNo?: number; // 업체번호
	vendorName?: string; // 업체명
	orderDate?: string; // 주문일자
	requestDate?: string; // 납기일자
	isApproval?: boolean; // 승인여부
	isClose?: boolean; // 마감여부
} 