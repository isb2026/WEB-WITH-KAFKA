import { Pageable, Sort } from '../common';
import { EstimateDetail } from './estimateDetail';

export interface GetAllEstimateMasterListPayload {
	page: number;
	size: number;
}

export interface GetAllEstimateMasterListWithDetailPayload {
	page: number;
	size: number;
}

export interface EstimateMasterListResponse {
	totalElements: number;
	totalPages: number;
	size: number;
	content: EstimateMaster[];
	number: number;
	sort: Sort;
	numberOfElements: number;
	pageable: Pageable;
	first: boolean;
	last: boolean;
	empty: boolean;
}

export interface EstimateMaster {
	tenantId: number; // 테넌트 ID
	isUse: boolean; // 사용 여부
	isDelete: boolean; // 삭제 여부
	createdAt: string; // 생성일시 (ISO 8601 형식)
	createdBy: string; // 생성자
	updatedAt: string; // 수정일시 (ISO 8601 형식)
	updatedBy: string; // 수정자
	id: number; // 견적서 마스터 ID
	estimateCode: string; // 견적서 코드, 예: EST-2024-001
	vendorNo: number; // 거래처 번호, 예: 1
	vendorName: string; // 거래처명, 예: 삼성전자
	taxDate: string; // 견적서 날짜, 예: 2024-03-20
	estimateDetails: EstimateDetail[]; // 견적서 상세 목록
}

export interface CreateEstimateMasterPayload {
	estimateCode?: string; // 납품 코드, 예: DEL-2024-001
	vendorNo: number; // 거래처 번호, 예: 1
	vendorName: string; // 거래처명, 예: 삼성전자
	taxDate: string; // 세금계산서 발행일, 예: 2024-03-20
	isUse?: boolean; // 사용 여부, 예: false (기본값: false)
}

export interface UpdateEstimateMasterPayload {
	estimateCode?: string;
	vendorNo: number;
	vendorName: string;
	taxDate: string;
	isUse: boolean;
}

export interface GetSearchEstimateMasterListPayload {
	page: number;
	size: number;
	searchRequest: SearchEstimateMasterRequest;
}

export interface SearchEstimateMasterRequest {
	createdAtEnd?: string; // 생성일시 종료 (ISO 8601 형식)
	createdAtStart?: string; // 생성일시 시작 (ISO 8601 형식)
	updatedAtEnd?: string; // 수정일시 종료 (ISO 8601 형식)
	updatedBy?: string; // 수정자, 예: admin
	updatedAtStart?: string; // 수정일시 시작 (ISO 8601 형식)
	isDelete?: boolean; // 삭제 여부, 예: false
	id?: number; // 견적 마스터 ID, 예: 1
	isUse?: boolean; // 사용 여부, 예: true
	createdBy?: string; // 생성자, 예: admin
}
