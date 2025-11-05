// Swagger-based Terminal Types

// TerminalSearchRequest - Terminal 검색 요청
export interface TerminalSearchRequest {
	isUse?: boolean; // 사용 여부
	createdAtStart?: string; // 생성일시 시작
	createdAtEnd?: string; // 생성일시 종료
	createdBy?: string; // 생성자
	updatedAtStart?: string; // 수정일시 시작
	updatedAtEnd?: string; // 수정일시 종료
	updatedBy?: string; // 수정자
	id?: number; // ID
	accountYear?: number; // 데이터 회계년
	terminalCode?: string; // Terminal code
	terminalName?: string; // Terminal name
	description?: string; // Description
	imageUrl?: string; // Image url
}

// TerminalCreateRequest - Terminal Create 요청
export interface TerminalCreateRequest {
	accountYear?: number; // 데이터 회계년
	terminalCode?: string; // Terminal code
	terminalName?: string; // Terminal name
	description?: string; // Description
	imageUrl?: string; // Image url
}

// TerminalListCreateRequest - Terminal 리스트 Create 요청
export interface TerminalListCreateRequest {
	dataList: TerminalCreateRequest[]; // 생성할 Terminal 데이터 리스트
}

// TerminalUpdateRequest - Terminal Update 요청
export interface TerminalUpdateRequest {
	isUse?: boolean; // 사용여부
	accountYear?: number; // 데이터 회계년
	terminalCode?: string; // Terminal code
	terminalName?: string; // Terminal name
	description?: string; // Description
	imageUrl?: string; // Image url
}

// TerminalUpdateAllRequest - Terminal 일괄 Update 요청
export interface TerminalUpdateAllRequest {
	id: number; // ID
	isUse?: boolean; // 사용여부
	accountYear?: number; // 데이터 회계년
	terminalCode?: string; // Terminal code
	terminalName?: string; // Terminal name
	description?: string; // Description
	imageUrl?: string; // Image url
}

// TerminalDto - Terminal 응답 데이터
export interface TerminalDto {
	id: number;
	tenantId: number;
	isDelete: boolean;
	isUse: boolean;
	accountYear: number;
	terminalCode: string;
	terminalName: string;
	description: string;
	imageUrl: string;
	createdBy: string;
	createdAt: string; // ISO date string
	updatedBy: string;
	updatedAt: string; // ISO date string
}

// Legacy types for backward compatibility
export interface GetAllTerminalListPayload {
	page: number;
	size: number;
	searchRequest?: TerminalSearchRequest;
}

export interface GetSearchTerminalListPayload {
	page: number;
	size: number;
	searchRequest: TerminalSearchRequest;
}

export interface createTerminalPayload extends TerminalCreateRequest {}
export interface updateTerminalPayload extends TerminalUpdateRequest {}
export interface SearchTerminalRequest extends TerminalSearchRequest {}
export interface Terminal extends TerminalDto {}
