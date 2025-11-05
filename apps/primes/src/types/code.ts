import { Pageable, Sort } from './common';

export interface GetAllCodeListPayload {
	page?: number;
	size?: number;
}

export interface GetSearchCodeListPayload {
	page: number;
	size: number;
	searchRequest: SearchCodeRequest;
}

interface SearchCodeRequest {
	/** 품목 ID */
	id?: number;
	/** 데이터 회계년 (예: 2024) */
	accountYear?: number;
	/** 그룹 코드 */
	groupCode?: string;
	/** 그룹명 */
	groupName?: string;
	/** 설명 */
	description?: string;
	/** 사용 여부 (예: true) */
	useState?: boolean;
	/** 삭제 여부 (예: false) */
	deleteState?: boolean;
	/** 생성자 (예: admin) */
	createdBy?: string;
	/** 수정자 (예: admin) */
	updatedBy?: string;
	/** 생성일시 시작 */
	createdAtStart?: string; // ISO Date string
	/** 생성일시 종료 */
	createdAtEnd?: string; // ISO Date string
	/** 수정일시 시작 */
	updatedAtStart?: string; // ISO Date string
	/** 수정일시 종료 */
	updatedAtEnd?: string; // ISO Date string
}

export interface CodeListResponse {
	totalElements: number;
	totalPages: number;
	size: number;
	content: Code[];
	number: number;
	sort: Sort;
	numberOfElements: number;
	pageable: Pageable;
	first: boolean;
	last: boolean;
	empty: boolean;
}

export interface Code {
	id: number;
	codeGroupId: number;
	codeGroup: string;
	tenantId: number;
	isDelete: boolean;
	isUse: boolean;
	codeValue: string;
	codeName: string;
	description: string;
	createdBy: string;
	createdAt: string;
	updatedBy: string;
	updatedAt: string;
}

export interface CodeGroup {
	id: number;
	tenantId: number;
	isDelete: boolean;
	isUse: boolean;
	parentId: number;
	isRoot: string;
	groupCode: string;
	groupName: string;
	description: string;
	createdBy: string;
	createdAt: string;
	updatedBy: string;
	updatedAt: string;
	codes: Code[];
	children: CodeGroup[];
}

export interface createCodePayload {
	codeGroupId: number;
	codeName: string;
	description?: string;
}

export interface createCodeGroupPayload {
	parentId?: number;
	isRoot?: 1 | 0;
	groupCode: string;
	groupName: string;
	description?: string;
}

export interface updateCodePayload {
	codeGroupId: number;
	// codeValue: string;
	codeName: string;
	description?: string;
}

export interface updateCodeGroupPayload {
	isUse?: 1 | 0;
	parentId?: number;
	isRoot?: number;
	groupCode?: string;
	groupName?: string;
	description?: string;
}
