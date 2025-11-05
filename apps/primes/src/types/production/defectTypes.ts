// 불량 기록 관련 타입 정의 (API 스펙 기반)

// 불량 상태 enum
export type DefectStatus = 'OPEN' | 'INVESTIGATING' | 'RESOLVED' | 'CLOSED';

// 불량 심각도 타입
export type DefectSeverity = 'HIGH' | 'MEDIUM' | 'LOW';

// 불량 처리 유형 enum
export type DefectActionType = 'TEMPORARY' | 'ROOT_CAUSE' | 'PREVENTIVE' | 'CORRECTIVE';

// DefectRecord 생성 요청 타입
export interface DefectRecordCreateRequest {
	defectCode: string; // 불량코드 (필수)
	itemId: number; // item ID (필수)
	itemNo: number; // item no (필수)
	itemNumber: string; // 제품코드 (필수)
	itemName?: string; // 제품명
	defectType?: string; // 불량 유형
	defectTypeCode?: string; // 불량 유형 코드
	defectReason?: string; // 불량 사유
	defectReasonCode?: string; // 불량 원인 코드
	defectDescription?: string; // 불량 설명
	defectQuantity?: number; // 불량 수량
	expectedLoss?: number; // 예상 손실 금액
	expectedLossCurrency?: string; // 예상 손실 화폐 단위
	reportDate?: string; // 신고일 (date format)
	reportedBy?: string; // 신고자
	severity?: DefectSeverity; // 심각도
	status?: DefectStatus; // 상태
	assignedTo?: string; // 담당자
	dueDate?: string; // 완료예정일 (date format)
	actionPlanDescription?: string; // 조치내용
	lotNo?: string; // LOT NO
	itemProgressId?: number; // 공정 ID
	progressName?: string; // 공정이름
}

// DefectRecord 수정 요청 타입
export interface DefectRecordUpdateRequest extends Partial<DefectRecordCreateRequest> {}

// DefectRecord 응답 타입
export interface DefectRecordDto {
	id: number;
	tenantId: number;
	isDelete: boolean;
	defectCode: string;
	itemId: number;
	itemNo: number;
	itemNumber: string;
	itemName?: string;
	defectType?: string;
	defectTypeCode?: string;
	defectReason?: string;
	defectReasonCode?: string;
	defectDescription?: string;
	defectQuantity?: number;
	expectedLoss?: number;
	expectedLossCurrency?: string;
	reportDate?: string; // date format
	reportedBy?: string;
	severity?: DefectSeverity;
	status: DefectStatus;
	assignedTo?: string;
	dueDate?: string; // date format
	actionPlanDescription?: string;
	lotNo?: string; // LOT NO
	itemProgressId?: number; // 공정 ID
	progressName?: string; // 공정이름
	createdBy: string;
	createdAt: string; // date-time format
	updatedBy: string;
	updatedAt: string; // date-time format
}

// DefectRecord 검색 요청 타입
export interface DefectRecordSearchRequest {
	createdAtStart?: string; // date-time format
	createdAtEnd?: string; // date-time format
	createdBy?: string;
	updatedAtStart?: string; // date-time format
	updatedAtEnd?: string; // date-time format
	updatedBy?: string;
	id?: number;
	defectCode?: string;
	itemId?: number;
	itemNo?: number;
	itemNumber?: string;
	itemName?: string;
	defectType?: string;
	defectTypeCode?: string;
	defectReason?: string;
	defectReasonCode?: string;
	defectQuantity?: number;
	reportDateStart?: string; // date format
	reportDateEnd?: string; // date format
	reportedBy?: string;
	severity?: DefectSeverity;
	status?: DefectStatus;
	assignedTo?: string;
	dueDateStart?: string; // date format
	dueDateEnd?: string; // date format
}

// DefectRecord 검색 응답 타입
export interface DefectRecordSearchResponse extends DefectRecordDto {
	statusCode?: string;
	statusValue?: string;
}

// DefectAction 생성 요청 타입
export interface DefectActionCreateRequest {
	defectRecordId: number; // 불량 기록 ID (필수)
	actionTaken: string; // 조치내용 (필수)
	actionDate?: string; // 조치일자 (date format)
	actionBy?: string; // 조치 담당자
	actionType?: 'TEMPORARY' | 'ROOT_CAUSE' | 'PREVENTIVE' | 'CORRECTIVE'; // 처리 유형
	workingHours?: number; // 소요시간
}

// DefectAction 수정 요청 타입
export interface DefectActionUpdateRequest extends Partial<DefectActionCreateRequest> {}

// DefectAction 응답 타입
export interface DefectActionDto {
	id: number;
	tenantId: number;
	isDelete: boolean;
	defectRecordId: number;
	defectRecord?: DefectRecordDto;
	actionDate?: string; // date format
	actionTaken: string;
	actionBy?: string;
	actionType?: 'TEMPORARY' | 'ROOT_CAUSE' | 'PREVENTIVE' | 'CORRECTIVE'; // 처리 유형
	workingHours?: number; // 소요시간
	createdBy: string;
	createdAt: string; // date-time format
	updatedBy: string;
	updatedAt: string; // date-time format
}

// DefectAction 검색 요청 타입
export interface DefectActionSearchRequest {
	createdAtStart?: string; // date-time format
	createdAtEnd?: string; // date-time format
	createdBy?: string;
	updatedAtStart?: string; // date-time format
	updatedAtEnd?: string; // date-time format
	updatedBy?: string;
	id?: number;
	defectRecordId?: number;
	actionDateStart?: string; // date format
	actionDateEnd?: string; // date format
	actionPlanDescription?: string;
	actionBy?: string;
	actionType?: 'TEMPORARY' | 'ROOT_CAUSE' | 'PREVENTIVE' | 'CORRECTIVE'; // 처리 유형
}

// DefectAction 검색 응답 타입
export interface DefectActionSearchResponse extends DefectActionDto {}

// 페이지네이션 관련 타입
export interface PageDefectRecordSearchResponse {
	totalPages: number;
	totalElements: number;
	size: number;
	content: DefectRecordSearchResponse[];
	number: number;
	first: boolean;
	last: boolean;
	empty: boolean;
}

export interface PageDefectActionSearchResponse {
	totalPages: number;
	totalElements: number;
	size: number;
	content: DefectActionSearchResponse[];
	number: number;
	first: boolean;
	last: boolean;
	empty: boolean;
}

// 공통 응답 타입
export interface CommonResponseDefectRecordDto {
	status: string;
	data: DefectRecordDto;
	message: string;
}

export interface CommonResponseListDefectRecordDto {
	status: string;
	data: DefectRecordDto[];
	message: string;
}

export interface CommonResponsePageDefectRecordSearchResponse {
	status: string;
	data: PageDefectRecordSearchResponse;
	message: string;
}

export interface CommonResponseDefectActionDto {
	status: string;
	data: DefectActionDto;
	message: string;
}

export interface CommonResponseListDefectActionDto {
	status: string;
	data: DefectActionDto[];
	message: string;
}

export interface CommonResponsePageDefectActionSearchResponse {
	status: string;
	data: PageDefectActionSearchResponse;
	message: string;
}

// 기존 페이지에서 사용하던 타입과의 호환성을 위한 매핑 타입
export interface DefectRecord {
	id: number;
	defectCode: string;
	itemId: number;
	itemNo: number;
	itemNumber: string;
	itemName: string;
	defectType: string;
	defectTypeCode?: string;
	defectReason: string;
	defectReasonCode?: string;
	defectDescription: string;
	reportDate: string;
	reportedBy: string;
	severity: DefectSeverity;
	status: 'OPEN' | 'INVESTIGATING' | 'RESOLVED' | 'CLOSED';
	assignedTo?: string;
	dueDate?: string;
	actionPlanDescription?: string;
}

// 매핑 함수들
export const mapDefectRecordDtoToDefectRecord = (dto: DefectRecordDto): DefectRecord => ({
	id: dto.id,
	defectCode: dto.defectCode,
	itemId: dto.itemId,
	itemNo: dto.itemNo,
	itemNumber: dto.itemNumber,
	itemName: dto.itemName || '',
	defectType: dto.defectType || '',
	defectTypeCode: dto.defectTypeCode,
	defectReason: dto.defectReason || '',
	defectReasonCode: dto.defectReasonCode,
	defectDescription: dto.defectDescription || '',
	reportDate: dto.reportDate || '',
	reportedBy: dto.reportedBy || '',
	severity: (dto.severity?.toUpperCase() as DefectSeverity) || 'MEDIUM',
	status: (dto.status?.toUpperCase() as 'OPEN' | 'INVESTIGATING' | 'RESOLVED' | 'CLOSED') || 'OPEN',
	assignedTo: dto.assignedTo,
	dueDate: dto.dueDate,
	actionPlanDescription: dto.actionPlanDescription,
});

export const mapDefectRecordToCreateRequest = (record: Partial<DefectRecord>): DefectRecordCreateRequest => ({
	defectCode: record.defectCode || '',
	itemId: record.itemId || 0,
	itemNo: record.itemNo || 0,
	itemNumber: record.itemNumber || '',
	itemName: record.itemName,
	defectType: record.defectType,
	defectTypeCode: record.defectTypeCode,
	defectReason: record.defectReason,
	defectReasonCode: record.defectReasonCode,
	defectDescription: record.defectDescription,
	reportDate: record.reportDate,
	reportedBy: record.reportedBy,
	severity: record.severity?.toUpperCase() as DefectSeverity,
	status: record.status?.toUpperCase() as DefectStatus,
	assignedTo: record.assignedTo,
	dueDate: record.dueDate,
	actionPlanDescription: record.actionPlanDescription,
});

// 불량 이력 데이터 타입
export interface DefectHistoryData {
	id: number;
	date: string;
	action: string;
	performedBy: string;
	description: string;
	status: string;
}

// 불량 추이 데이터 타입
export interface DefectTrendData {
	date: string;
	count: number;
	severity?: DefectSeverity;
}

// 불량 추이 응답 타입
export interface DefectTrendResponse {
	productCode: string;
	productName?: string;
	period: {
		startDate: string;
		endDate: string;
	};
	trends: DefectTrendData[];
	summary: {
		totalDefects: number;
		highSeverityCount: number;
		mediumSeverityCount: number;
		lowSeverityCount: number;
	};
} 