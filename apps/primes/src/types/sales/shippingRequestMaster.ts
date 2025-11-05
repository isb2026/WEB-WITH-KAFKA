import { Pageable, Sort } from '../common';
import { ShippingRequestDetail } from './shippingRequestDetail';

export interface GetAllShippingRequestMasterListPayload {
	page: number;
	size: number;
}

export interface GetAllShippingRequestMasterListWithDetailPayload {
	page: number;
	size: number;
}

export interface ShippingRequestMasterListResponse {
	totalElements: number;
	totalPages: number;
	size: number;
	content: ShippingRequestMaster[];
	number: number;
	sort: Sort;
	numberOfElements: number;
	pageable: Pageable;
	first: boolean;
	last: boolean;
	empty: boolean;
}

export interface ShippingRequestMaster {
	tenantId: number; // 테넌트 ID
	isUse: boolean; // 사용 여부
	isDelete: boolean; // 삭제 여부
	createdAt: string; // 생성일시 (ISO 8601 형식)
	createdBy: string; // 생성자
	updatedAt: string; // 수정일시 (ISO 8601 형식)
	updatedBy: string; // 수정자
	id: number; // ID
	shippingRequestCode?: string; // 납품 요청 코드
	vendorNo: number; // 거래처 번호
	vendorName: string; // 거래처명
	requestDate: string; // 요청일 (yyyy-MM-dd)
	shippingRequestDetails: ShippingRequestDetail[]; // 전표 상세 내역
}

export interface CreateShippingRequestMasterPayload {
	shippingRequestCode?: string; // 납품 요청 코드, 예: SHIP-2024-001
	vendorNo: number; // 거래처 번호, 예: 1
	vendorName: string; // 거래처명, 예: 삼성전자
	requestDate: string; // 요청일, 예: 2024-03-20
	isUse?: boolean; // 사용 여부, 예: true
}

export interface UpdateShippingRequestMasterPayload {
	shippingRequestCode: string; // 납품 요청 코드, 예: SHIP-2024-001
	vendorNo: number; // 거래처 번호, 예: 1
	vendorName: string; // 거래처명, 예: 삼성전자
	requestDate: string; // 요청일, 예: 2024-03-20
	isUse: boolean; // 사용 여부, 예: true
}

export interface GetSearchShippingRequestMasterListPayload {
	page: number;
	size: number;
	searchRequest: SearchShippingRequestMasterRequest;
}

export interface SearchShippingRequestMasterRequest {
	createdAtEnd?: string; // 생성일시 종료 (ISO 8601 형식)
	createdAtStart?: string; // 생성일시 시작 (ISO 8601 형식)
	updatedAtEnd?: string; // 수정일시 종료 (ISO 8601 형식)
	updatedBy?: string; // 수정자, 예: admin
	updatedAtStart?: string; // 수정일시 시작 (ISO 8601 형식)
	isDelete?: boolean; // 삭제 여부, 예: false
	id?: number; // ID, 예: 1
	isUse?: boolean; // 사용 여부, 예: true
	createdBy?: string; // 생성자, 예: admin
}
