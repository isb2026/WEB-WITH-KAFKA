import { Pageable, Sort } from '../common';
import { ShipmentDetail } from './shipmentDetail';

export interface GetAllShipmentListPayload {
	page: number;
	size: number;
}

export interface GetAllShipmentListWithDetailPayload {
	page: number;
	size: number;
}

export interface ShipmentListResponse {
	totalElements: number;
	totalPages: number;
	size: number;
	content: ShipmentMaster[];
	number: number;
	sort: Sort;
	numberOfElements: number;
	pageable: Pageable;
	first: boolean;
	last: boolean;
	empty: boolean;
}

export interface ShipmentMaster {
	tenantId: number;
	isUse: boolean;
	isDelete: boolean;
	createdAt: string;
	createdBy: string;
	updatedAt: string;
	updatedBy: string;
	id: number;
	shipmentCode: string;
	vendorNo: number;
	vendorName: string;
	shipmentDetails: ShipmentDetail[];
}

export interface CreateShipmentMasterPayload {
	shipmentCode?: string;
	vendorNo: number;
	vendorName: string;
	requestDate: string;
	isUse?: boolean;
}

export interface UpdateShipmentMasterPayload {
	shipmentCode?: string;
	vendorNo: number;
	vendorName: string;
	requestDate: string;
	isUse: boolean;
}

export interface GetSearchShipmentMasterListPayload {
	page: number;
	size: number;
	searchRequest: SearchShipmentMasterRequest;
}

export interface SearchShipmentMasterRequest {
	createdAtEnd?: string; // 생성일시 종료
	createdAtStart?: string; // 생성일시 시작
	createdBy?: string; // 생성자, 예: admin
	updatedAtEnd?: string; // 수정일시 종료
	updatedAtStart?: string; // 수정일시 시작
	updatedBy?: string; // 수정자, 예: admin
	isDelete?: boolean; // 삭제 여부, 예: false
	isUse?: boolean; // 사용 여부, 예: true
	id?: number; // ID, 예: 1
}
