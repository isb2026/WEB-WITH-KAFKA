import { Pageable, Sort } from './common';

export interface GetAllCodeGroupListPayload {
	page: number;
	size: number;
}

export interface GetSearchCodeGroupListPayload {
	page: number;
	size: number;
	searchRequest: SearchCodeGroupRequest;
}

interface SearchCodeGroupRequest {
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

export interface CodeGroupListResponse {
	totalElements: number;
	totalPages: number;
	size: number;
	content: CodeGroup[];
	number: number;
	sort: Sort;
	numberOfElements: number;
	pageable: Pageable;
	first: boolean;
	last: boolean;
	empty: boolean;
}

export interface CodeGroup {
	accountYear: number;
	useState: boolean;
	deleteState: boolean;
	createdAt: string;
	createdBy: string;
	updatedAt: string;
	updatedBy: string;
	tenantId: number;
	id: number;
	solutionId: number;
	solutionName: string;
	groupCode: string;
	groupName: string;
	description: string;
}

export interface createCodeGroupPayload {
	solutionId: number;
	groupCode: string;
	groupName: string;
	description?: string;
}

export interface updateCodeGroupPayload {
	solutionName: string;
	groupCode: string;
	groupName: string;
	description?: string;
	useState: boolean;
}
