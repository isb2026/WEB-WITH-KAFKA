import { Pageable, Sort } from './common';

export interface AccountSearchRequest {
	isUse?: boolean;
	isDelete?: boolean;
	createdAtStart?: string; // ISO date-time
	createdAtEnd?: string; // ISO date-time
	createdBy?: string;
	updatedAtStart?: string; // ISO date-time
	updatedAtEnd?: string; // ISO date-time
	updatedBy?: string;
	id?: number;
	accountStyleId?: number;
	meterId?: number;
	locationId?: number; // Backend uses locationId for filtering by company/workplace
	name?: string;
	supplier?: string;
}
export interface SearchAccountRequest {
	companyId?: number;
	isUse?: boolean;
	isDelete?: boolean;
	createdAtStart?: string;
	createdAtEnd?: string;
	createdBy?: string;
	updatedAtStart?: string;
	updatedAtEnd?: string;
	updatedBy?: string;
	id?: number;
	accountStyleId?: number;
	meterId?: number;
	locationId?: number;
	name?: string;
	supplier?: string;
}

export interface GetAllAccountListPayload {
	page: number;
	size: number;
	searchRequest?: SearchAccountRequest;
}

export interface GetSearchAccountListPayload {
	page: number;
	size: number;
	searchRequest?: SearchAccountRequest;
}

export interface Account {
	/** 고유 ID */
	id: number;
	/** 계정 스타일 ID */
	accountStyleId: number;
	/** 미터(계량기) ID */
	meterId: number;
	/** 회사 ID */
	companyId: number;
	/** 위치(로케이션) ID */
	locationId: number;
	/** 테넌트 ID */
	tenantId: number;
	/** 담당자 ID */
	chargerId?: number;
	/** 담당자 사용자명 */
	chargerUsername?: string;
	/** 담당자 이름 (조인된 데이터) */
	chargerName?: string;
	/** 사용 여부 */
	isUse: boolean;
	/** 삭제 여부 */
	isDelete: boolean;
	/** 장비 이름 */
	name: string;
	/** 공급사 */
	supplier: string;
	/** 생성 일시 (ISO 8601 문자열) */
	createdAt: string;
	/** 생성자 */
	createdBy: string;
	/** 수정 일시 (ISO 8601 문자열) */
	updatedAt: string;
	/** 수정자 */
	updatedBy: string;
}

export interface AccountListResponse {
	content: Account[];
	pageable: Pageable;
	sort: Sort;
	totalElements: number;
	totalPages: number;
	last: boolean;
	size: number;
	number: number;
	numberOfElements: number;
	first: boolean;
	empty: boolean;
}

export interface CreateAccountPayload {
	/** AccountStyle id (예: 1) */
	accountStyleId?: number;
	/** Meter id (예: 1) */
	meterId?: number;
	/** Company id (예: 1) */
	companyId?: number;
	/** Charger id (예: 1) */
	chargerId?: number;
	/** Charger username (예: "de.lee") */
	chargerUsername?: string;
	/** Name (예: "name") */
	name?: string;
	/** Supplier (예: "supplier") */
	supplier?: string;
}

export interface UpdateAccountPayload {
	/** AccountStyle id (예: 1) */
	accountStyleId?: number;
	/** Meter id (예: 1) */
	meterId?: number;
	/** Company id (예: 1) */
	companyId?: number;
	/** Charger id (예: 1) */
	chargerId?: number;
	/** Charger username (예: "de.lee") */
	chargerUsername?: string;
	/** Name (예: "name") */
	name?: string;
	/** Supplier (예: "supplier") */
	supplier?: string;
	/** Use Able*/
	isUse?: boolean;
}
