// Production Command 관련 타입 정의

// Plan 타입 정의 (nested in Command)
export interface PlanData {
	id: number;
	tenantId: number;
	isDelete: boolean;
	accountMon: string;
	planCode: string;
	itemId: number;
	itemNo: number;
	planQuantity: number;
	planType: string;
	vendorOrderCode: string;
	status: string;
	itemUnit: string;
	createdBy: string;
	createdAt: string;
	updatedBy: string;
	updatedAt: string;
}

// Command 타입 정의 (API 응답 구조에 맞춤)
export interface Command {
	id: number;
	tenantId: number;
	isDelete: boolean;
	plan: PlanData;
	accountMon?: string;
	planId?: number;
	planCode?: string;
	commandNo?: string;
	commandGroupNo?: string;
	commandProgressSeq?: string;
	itemId?: number;
	itemNo?: number;
	itemNumber?: string;
	itemName?: string;
	itemSpec?: string;
	progressId?: number;
	progressTypeCode?: string;
	progressName?: string;
	progressOrder?: number;
	preProgressId?: number;
	isOutsourcing?: boolean;
	machineId?: number;
	machineName?: string;
	machineCode?: string;
	commandAmount?: number;
	commandWeight?: number;
	unit?: string;
	startDate?: string;
	endDate?: string;
	startTime?: string;
	endTime?: string;
	status?: string;
	statusValue?: string;
	isClose?: boolean;
	closeBy?: string;
	closeAt?: string;
	createdBy?: string;
	createdAt?: string;
	updatedBy?: string;
	updatedAt?: string;
}

// API Payload 타입 정의 (DB 스키마에 맞춤)
export interface CreateCommandPayload {
	accountMon?: string;
	planId?: number;
	planCode?: string;
	itemId?: number;
	itemNo?: number;
	itemNumber?: string;
	itemName?: string;
	itemSpec?: string;
	progressId?: number;
	progressTypeCode?: string;
	progressName?: string;
	progressOrder?: number;
	isOutsourcing?: boolean;
	commandAmount?: number;
	commandWeight?: number;
	unit?: string;
	machineCode?: string;
	startDate?: string;
	endDate?: string;
	startTime?: string;
	endTime?: string;
	status?: string;
	isClose?: boolean;
	closeBy?: string;
	closeAt?: string;
}

export interface UpdateCommandPayload extends Partial<CreateCommandPayload> {
	id: number;
}

// 검색 및 목록 조회 타입
export interface CommandSearchRequest {
	id?: number;
	accountMon?: string;
	commandNo?: string;
	commandGroupNo?: string;
	progressId?: number;
	preProgressId?: number;
	itemName?: string;
	status?: string;
	startDate?: string;
	endDate?: string;
}

export interface CommandListParams {
	searchRequest?: CommandSearchRequest;
	page?: number;
	size?: number;
}
