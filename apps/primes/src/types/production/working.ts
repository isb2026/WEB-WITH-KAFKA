// Production Working 관련 타입 정의
import { FieldOption, FieldQueryParams } from './common';

// Working Master 타입 정의 (Swagger 기반)
export interface WorkingMaster {
	id: number;
	tenantId: number;
	isDelete: boolean;
	commandId?: number;
	command?: CommandDto;
	commandNo?: string;
	workBy?: string;
	workDate?: string;
	shift?: string;
	workAmount?: number;
	workWeight?: number;
	workUnit?: string;
	boxAmount?: number;
	machineCode?: string;
	machineName?: string;
	lineNo?: string;
	standardTime?: number;
	workHour?: number;
	workCode?: string;
	startTime?: string;
	endTime?: string;
	workingDetails?: WorkingDetail[];
	workingUsers?: any[];
	createdBy?: string;
	createdAt?: string;
	updatedBy?: string;
	updatedAt?: string;
}

// Command DTO (Working에서 참조)
export interface CommandDto {
	id: number;
	tenantId: number;
	isDelete: boolean;
	planId?: number;
	planCode?: string;
	accountMon?: string;
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
	isOutsourcing?: boolean;
	commandAmount?: number;
	commandWeight?: number;
	unit?: string;
	startDate?: string;
	endDate?: string;
	startTime?: string;
	endTime?: string;
	status?: string;
	isClose?: boolean;
	closeBy?: string;
	closeAt?: string;
	createdBy?: string;
	createdAt?: string;
	updatedBy?: string;
	updatedAt?: string;
}

// Working Detail 타입 정의
export interface WorkingDetail {
	id: number;
	workingMasterId: number;
	workingMaster?: WorkingMaster;
	workCode?: string;
	commandId?: number;
	command?: any;
	commandNo?: string;
	lotNo?: string;
	itemId?: number;
	itemNo?: number;
	progressId?: number;
	progressName?: string;
	lineNo?: string;
	startTime?: string;
	endTime?: string;
	workAmt?: number;
	workUnit?: string;
	boxAmt?: number;
	isClose?: boolean;
	isOutsourcing?: boolean;
	inOut?: string;
	outsourcingVendorId?: number;
	outsourcingVendorName?: string;
	status?: string;
	jobType?: string;
	badStatusCode?: string;
	badReasonCode?: string;
	produceDt?: string;
	workingInLots?: any[];
	createdAt?: string;
	updatedAt?: string;
}

// API Payload 타입 정의
export interface CreateWorkingPayload {
	commandId?: number;
	commandNo?: string;
	workBy?: string;
	workDate?: string;
	standardTime?: number;
	workHour?: number;
	shift?: string;
	startTime?: string;
	endTime?: string;
}

export interface CreateWorkingDetailPayload {
	workingMasterId: number;
	workCode?: string;
	commandId?: number;
	commandNo?: string;
	lotNo?: string;
	itemId?: number;
	itemNo?: number;
	progressId?: number;
	progressName?: string;
	lineNo?: string;
	startTime?: string;
	endTime?: string;
	workAmt?: number;
	workUnit?: string;
	boxAmt?: number;
	isClose?: boolean;
	isOutsourcing?: boolean;
	inOut?: string;
	outsourcingVendorId?: number;
	outsourcingVendorName?: string;
	status?: string;
	jobType?: string;
	badStatusCode?: string;
	badReasonCode?: string;
	produceDt?: string;
}

export interface UpdateWorkingPayload extends Partial<CreateWorkingPayload> {
	id: number;
}

export interface UpdateWorkingDetailPayload
	extends Partial<CreateWorkingDetailPayload> {
	id: number;
}

// 검색 및 목록 조회 타입
export interface WorkingSearchRequest {
	commandId?: number;
	commandNo?: string;
	lotId?: number;
	workBy?: string;
	workDate?: string;
	shift?: string;
	workCode?: string;
	startDate?: string;
	endDate?: string;
}

export interface WorkingDetailSearchRequest {
	workingMasterId?: number;
	workCode?: string;
	commandNo?: string;
	lotNo?: string;
}

export interface WorkingListParams {
	searchRequest?: WorkingSearchRequest;
	page?: number;
	size?: number;
}

export interface WorkingDetailListParams {
	searchRequest?: WorkingDetailSearchRequest;
	page?: number;
	size?: number;
}

// ===== 새로운 작업실적 등록 관련 타입들 =====

// 사용된 자재 정보 (작업실적 등록 시)
export interface UsedMaterialRequest {
	lotId: number; // 로트 ID
	lotNo: string;
	itemId: number;
	usingQty: number;
	usingWeight: number;
	workUnit?: string;
}

// 작업실적 등록 요청 (핵심!)
export interface WorkingResultRegisterRequest {
	commandNo: string; // 작업지시번호 (필수)
	commandId?: number; // 작업지시 ID
	workDate: string; // 작업일자 (필수)
	workAmount: number; // 작업 수량 (총 생산량) (필수)
	boxAmount: number; // 장입량 (박스당 수량) (필수)
	shift?: string; // 교대
	workWeight?: number; // 작업 중량
	workUnit?: string; // 중량 단위
	workBy?: string; // 작업자
	machineCode?: string; // 기계 코드
	machineName?: string; // 기계명
	lineNo?: string; // 라인 번호
	usedMaterials?: UsedMaterialRequest[]; // 사용된 자재 목록
}

// 생성된 로트 정보
export interface CreatedLotInfo {
	lotId: number; // 로트 ID
	lotNo: string; // 로트 번호
	lotAmount: number; // 로트 수량
	lotWeight: number; // 로트 중량
}

// 사용된 자재 정보 (응답)
export interface UsedMaterialInfo {
	usingLotId: number; // UsingLot ID
	lotId: number; // 로트 ID
	lotNo: string; // 로트 번호
	itemName: string; // 자재명
	usedQty: number; // 사용 수량
	usedWeight: number; // 사용 중량
}

// 작업실적 등록 응답
export interface WorkingResultRegisterResponse {
	workingId: number; // 작업 ID
	commandNo: string; // 작업지시번호
	workDate: string; // 작업일자
	workAmount: number; // 작업 수량
	workWeight?: number; // 작업 중량
	createdLots: CreatedLotInfo[]; // 생성된 로트 목록
	usedMaterials: UsedMaterialInfo[]; // 사용된 자재 목록
}

// ===== 자재 투입 관련 타입들 =====

// WorkingInLot DTO (API 응답)
export interface WorkingInLotDto {
	id: number;
	tenantId: number;
	isDelete: boolean;
	workingDetailId?: number;
	workingBufferId?: number;
	workingBuffer?: any; // WorkingBufferDto 참조
	lotNo: string;
	itemId: number;
	itemNo?: number;
	itemNumber?: string;
	itemName?: string;
	itemSpec?: string;
	inLotNo?: string;
	progressId?: number;
	jobType?: string;
	useAmount?: number;
	useWeight?: number;
	inputDate?: string;
	lotUnit?: string;
	createdBy?: string;
	createdAt?: string;
	updatedBy?: string;
	updatedAt?: string;
}

// WorkingInLot (간소화된 버전)
export interface WorkingInLot {
	id: number;
	lotNo: string;
	itemId: number;
	itemNo: number;
	itemNumber: string;
	itemName: string;
	itemSpec: string;
	inLotNo: string;
	useAmount: number;
	useWeight: number;
	inputDate: string;
	progressId: number;
	jobType: string;
	lotUnit: string;
}

// WorkingInLot 생성 요청
export interface WorkingInLotCreateRequest {
	workingBufferId?: number; // working_buffer index
	commandId?: number; // command index
	commandNo: string; // command no
	lotMasterId?: number; // lot index
	lotNo: string; // LOT 번호
	itemId: number; // 제품 ID
	itemNo?: number; // 아이템 번호
	itemNumber?: string; // 품번
	itemName?: string; // 품명
	itemSpec?: string; // 규격
	progressId?: number;
	inLotMasterId?: number; // in_lot index
	inLotNo?: string;
	jobType?: string;
	useAmount?: number;
	useWeight?: number;
	inputDate?: string;
	lotUnit?: string;
}

// WorkingInLot 수정 요청
export interface WorkingInLotUpdateRequest {
	id: number;
	workingDetailId?: number;
	workingBufferId?: number;
	lotNo?: string;
	itemId?: number;
	itemNo?: number;
	itemNumber?: string;
	itemName?: string;
	itemSpec?: string;
	progressId?: number;
	inLotNo?: string;
	jobType?: string;
	useAmount?: number;
	useWeight?: number;
	inputDate?: string;
	lotUnit?: string;
}

// WorkingInLot 검색 요청
export interface WorkingInLotSearchRequest {
	commandId?: number; // 작업지시 ID로 직접 조회
	workingDetailId?: number;
	workingBufferId?: number;
	lotNo?: string;
	itemId?: number;
	itemNumber?: string;
	itemName?: string;
	progressId?: number; // 공정 ID로 조회
	jobType?: string;
	inputDateFrom?: string;
	inputDateTo?: string;
}

// WorkingInLot 검색 요청
export interface WorkingInLotSearchRequest {
	commandId?: number; // 작업지시 ID로 직접 조회
	workingDetailId?: number;
	workingBufferId?: number;
	lotNo?: string;
	itemId?: number;
	itemNumber?: string;
	itemName?: string;
	progressId?: number; // 공정 ID로 조회
	jobType?: string;
	inputDateFrom?: string;
	inputDateTo?: string;
}

// WorkingInLot 일괄 수정 요청
export interface WorkingInLotUpdateAllRequest {
	ids: number[];
	updateData: WorkingInLotUpdateRequest;
}

// ===== 사용량 기록 관련 타입들 =====

// UsingLot 생성 요청
export interface UsingLotCreateRequest {
	commandId?: number; // 작업지시 ID
	lotNo: string; // LOT 번호 (필수)
	itemId: number; // 아이템 ID (필수)
	itemNo?: number; // 아이템 번호
	itemNumber?: string; // 품번
	itemName?: string; // 품명
	itemSpec?: string; // 규격
	usingQty?: number; // 사용 수량
	workWeight?: number; // 사용 중량
	workUnit?: string; // 중량 단위
}

// ===== WorkingBuffer 관련 타입들 =====

// WorkingBuffer 업데이트 요청 (자재 회수)
export interface WorkingBufferUpdateRequest {
	id: number; // WorkingBuffer ID
	returnDate?: string; // 회수일자
	returnQty?: number; // 회수 수량
	returnWeight?: number; // 회수 중량
	memo?: string; // 메모
}
