// Production Material Request 관련 타입 정의

// Material Request 타입 정의
export interface MaterialRequest {
	id: number;
	requestNo: string;
	requestDate?: string;
	itemId?: number;
	itemCode?: string;
	itemName?: string;
	requestQuantity?: number;
	approvedQuantity?: number;
	issuedQuantity?: number;
	urgency?: string;
	status?: string;
	requestBy?: string;
	approvedBy?: string;
	issuedBy?: string;
	workingId?: number;
	commandId?: number;
	lineId?: number;
	storageLocation?: string;
	description?: string;
	requestDate2?: string;
	approvedDate?: string;
	issuedDate?: string;
	createdAt?: string;
	updatedAt?: string;
}

// API Payload 타입 정의
export interface CreateMaterialRequestPayload {
	requestNo: string;
	requestDate?: string;
	itemId?: number;
	requestQuantity?: number;
	urgency?: string;
	status?: string;
	requestBy?: string;
	workingId?: number;
	commandId?: number;
	lineId?: number;
	storageLocation?: string;
	description?: string;
}

export interface UpdateMaterialRequestPayload
	extends Partial<CreateMaterialRequestPayload> {
	id: number;
	approvedQuantity?: number;
	issuedQuantity?: number;
	approvedBy?: string;
	issuedBy?: string;
	approvedDate?: string;
	issuedDate?: string;
}

// 검색 및 목록 조회 타입
export interface MaterialRequestSearchRequest {
	requestNo?: string;
	itemCode?: string;
	itemName?: string;
	status?: string;
	urgency?: string;
	requestBy?: string;
	lineId?: number;
	startDate?: string;
	endDate?: string;
}

export interface MaterialRequestListParams {
	searchRequest?: MaterialRequestSearchRequest;
	page?: number;
	size?: number;
}
