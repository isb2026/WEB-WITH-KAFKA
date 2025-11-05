import { Pageable, Sort } from './common';
export type CompanyType = 'COMPANY' | 'GROUP' | 'WORKPLACE';

export interface GetAllCompanyListPayload {
	page: number;
	size: number;
	searchRequest?: SearchCompanyRequest;
}

export interface GetSearchCompanyListPayload {
	page: number;
	size: number;
	searchRequest: SearchCompanyRequest;
}

interface SearchCompanyRequest {
	isUse?: boolean;
	isDelete?: boolean;
	createdAtStart?: string;
	createdAtEnd?: string;
	createdBy?: string;
	updatedAtStart?: string;
	updatedAtEnd?: string;
	updatedBy?: string;
	id?: number;
	name?: string;
	license?: string;
	companyType?: CompanyType;
	isApproved?: boolean;
	businessType?: string;
	businessItem?: string;
	approvedCharger?: string;
}

export interface GetFieldDataPayload {
	companyType?: string;
	isApproved?: boolean;
	businessType?: string;
	businessItem?: string;
}

export interface CompanyListResponse {
	totalElements: number;
	totalPages: number;
	size: number;
	content: Company[];
	number: number;
	sort: Sort;
	numberOfElements: number;
	pageable: Pageable;
	first: boolean;
	last: boolean;
	empty: boolean;
}

export interface Company {
	/** 회사 ID */
	companyId: number;
	/** 부모 회사 ID */
	parentId: number;
	/** 회사 이름 */
	name: string;
	/** 라이선스 */
	license: string;
	/** 회사 유형 */
	companyType: CompanyType;
	/** 승인 여부 */
	isApproved: boolean;
	/** 업종 구분 */
	businessType: string;
	/** 업종 항목 */
	businessItem: string;
	/** 승인 담당자 */
	approvedCharger: string;
	/** 주소 */
	address: string;
	/** 상세 주소 */
	addressDetail: string;
	/** 우편번호 */
	postcode: number;
	/** 위도 */
	latitude: number;
	/** 경도 */
	longitude: number;
	/** 보고 비율 */
	reportPercent: number;
}

export interface createCompanyPayload {
	/** Parent id */
	groupId?: number | null;
	/** Name */
	name?: string | null;
	/** License */
	license?: string | null;
	/** Company type */
	companyType?: CompanyType | null;
	/** Is approved */
	isApproved?: boolean | null;
	/** Business type */
	businessType?: string | null;
	/** Business item */
	businessItem?: string | null;
	/** Approved charger */
	approvedCharger?: string | null;
	/** Address */
	address?: string | null;
	/** Address detail */
	addressDetail?: string | null;
	/** Postcode */
	postcode?: number | null;
	/** Latitude */
	latitude?: number | null;
	/** Longitude */
	longitude?: number | null;
	/** Report percent */
	// reportPercent?: number | null;
}

export interface UpdateCompanyPayload {
	/** 사용 여부 */
	// isUse?: boolean | null;
	/** 부모 ID */
	groupId?: number | null;
	/** 자식 ID */
	childId?: number | null;
	/** 이름 */
	name?: string | null;
	/** 라이선스 */
	license?: string | null;
	/** 회사 유형 */
	companyType?: CompanyType | null;
	/** 승인 여부 */
	isApproved?: boolean | null;
	/** 업종 구분 */
	businessType?: string | null;
	/** 업종 항목 */
	businessItem?: string | null;
	/** 승인 담당자 */
	approvedCharger?: string | null;
	/** 주소 */
	address?: string | null;
	/** 상세 주소 */
	addressDetail?: string | null;
	/** 우편번호 */
	postcode?: number | null;
	/** 위도 */
	latitude?: number | null;
	/** 경도 */
	longitude?: number | null;
	/** 보고 비율 */
	reportPercent?: number | null;
}

export interface CompanyTreeNode {
	id: number | string;
	companyId?: number;
	name: string;
	companyType: CompanyType;
	children?: CompanyTreeNode[];
}
