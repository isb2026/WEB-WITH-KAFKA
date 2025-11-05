import { Pageable, Sort } from '../common';

export interface GetAllDeliveryMasterListPayload {
	page: number;
	size: number;
}

export interface GetAllDeliveryMasterListWithDetailPayload {
	page: number;
	size: number;
}

export interface DeliveryMasterListResponse {
	totalElements: number;
	totalPages: number;
	size: number;
	content: DeliveryMaster[];
	number: number;
	sort: Sort;
	numberOfElements: number;
	pageable: Pageable;
	first: boolean;
	last: boolean;
	empty: boolean;
}

export interface DeliveryMaster {
	tenantId: number; // 테넌트 ID
	isUse: boolean; // 사용 여부
	isDelete: boolean; // 삭제 여부
	createdAt: string; // 생성일시 (ISO 8601 형식)
	createdBy: string; // 생성자
	updatedAt: string; // 수정일시 (ISO 8601 형식)
	updatedBy: string; // 수정자
	id: number; // 납품 마스터 ID
	deliveryCode: string; // 납품 코드, 예: 250513-0001
	vendorNo: number; // 업체번호
	vendorName: string; // 업체명
	deliveryDate: string; // 납품일자
	deliveryLocationCode: number; // 납품처코드
	deliveryLocation: string; // 납품처명
	currencyUnit: string; // 통화단위
	isApproval: boolean; // 승인여부
	approvalBy: string; // 승인자명
	approvalAt: string; // 승인일시 (ISO 8601 형식)
	isClose: boolean; // 마감여부
	closeBy: string; // 마감자명
	closeAt: string; // 마감일시 (ISO 8601 형식)
	deliveryDetails: any[]; // 납품 상세 목록
}

export interface CreateDeliveryMasterPayload {
	deliveryCode?: string; // 납품 코드, 예: 250513-0001
	vendorNo: number; // 업체번호
	vendorName: string; // 업체명
	deliveryDate: string; // 납품일자
	deliveryLocationCode?: number; // 납품처코드
	deliveryLocation?: string; // 납품처명
	currencyUnit?: string; // 통화단위
	isUse?: boolean; // 사용 여부, 예: false (기본값: false)
}

export interface UpdateDeliveryMasterPayload {
	deliveryCode?: string;
	vendorNo: number;
	vendorName: string;
	deliveryDate: string;
	deliveryLocationCode?: number;
	deliveryLocation?: string;
	currencyUnit?: string;
	isApproval?: boolean;
	approvalBy?: string;
	approvalAt?: string;
	isClose?: boolean;
	closeBy?: string;
	closeAt?: string;
	isUse?: boolean;
}

export interface GetSearchDeliveryMasterListPayload {
	page: number;
	size: number;
	searchRequest: SearchDeliveryMasterRequest;
}

export interface SearchDeliveryMasterRequest {
	createdAtEnd?: string; // 생성일시 종료 (ISO 8601 형식)
	createdAtStart?: string; // 생성일시 시작 (ISO 8601 형식)
	updatedAtEnd?: string; // 수정일시 종료 (ISO 8601 형식)
	updatedBy?: string; // 수정자, 예: admin
	updatedAtStart?: string; // 수정일시 시작 (ISO 8601 형식)
	isDelete?: boolean; // 삭제 여부, 예: false
	id?: number; // 납품 마스터 ID, 예: 1
	isUse?: boolean; // 사용 여부, 예: true
	createdBy?: string; // 생성자, 예: admin
	deliveryCode?: string; // 납품 코드
	vendorNo?: number; // 업체번호
	vendorName?: string; // 업체명
	deliveryDate?: string; // 납품일자
	isApproval?: boolean; // 승인여부
	isClose?: boolean; // 마감여부
} 