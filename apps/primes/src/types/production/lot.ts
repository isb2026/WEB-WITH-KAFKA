// Production Lot 관련 타입 정의 (Swagger 기반)

// Lot Master 인터페이스 (Swagger 기반)
export interface LotMaster {
	id: number;
	tenantId: number;
	isDelete: boolean;
	commandId?: number; // 지시 ID
	command?: any; // Command 참조 (CommandDto는 working.ts에서 정의됨)
	itemId?: number; // 아이템 ID
	lotNo: string; // LOT 번호 (필수)
	itemNo?: number; // 품목 번호
	itemNumber?: string; // 품번
	itemName?: string; // 품명
	itemSpec?: string; // 규격
	lotAmount?: number; // LOT 수량
	lotWeight?: number; // LOT 중량
	restAmount?: number; // LOT 잔량(수량)
	restWeight?: number; // LOT 잔량(중량)
	lotUnit?: string; // 단위
	createdBy?: string;
	createdAt?: string;
	updatedBy?: string;
	updatedAt?: string;
}

// Command DTO는 working.ts에서 import하여 사용

// Lot 타입 (호환성을 위한 별칭)
export interface Lot extends LotMaster {}

// Lot 생성 Payload (Swagger 기반)
export interface CreateLotPayload {
	commandId?: number; // 지시 ID
	itemId?: number; // 아이템 ID
	itemNo?: number; // 아이템코드
	itemNumber?: string; // 품번
	itemName?: string; // 품명
	itemSpec?: string; // 규격
	lotAmount?: number; // lot 수량
	lotWeight?: number; // lot 중량
	restAmount?: number; // lot 잔량(수량)
	restWeight?: number; // lot 잔량(중량)
	lotUnit?: string; // 단위
}

// Lot 수정 Payload
export interface UpdateLotPayload extends Partial<CreateLotPayload> {
	id: number;
}

// Lot 일괄 수정 Payload
export interface UpdateLotAllPayload extends Partial<CreateLotPayload> {
	id: number;
}

// Lot 검색 요청 (Swagger 기반)
export interface LotSearchRequest {
	lotNo?: string; // LOT 번호
	itemNumber?: string; // 품번
	itemName?: string; // 품명
	createDate?: string; // 생성일자
	commandId?: number; // 지시 ID
}

// LOT 조건 (conditions 배열의 각 항목)
export interface LotCondition {
	itemId?: number; // 아이템 ID
	progressId?: number; // 공정 ID
}

// Lot 조건부 검색 요청 (새로운 API용 - Swagger 스펙 기반)
export interface LotSearchWithConditionsRequest {
	conditions?: LotCondition[]; // 조건 배열
	createdAtStart?: string; // 생성일시 시작
	createdAtEnd?: string; // 생성일시 종료
	createdBy?: string; // 생성자
	updatedAtStart?: string; // 수정일시 시작
	updatedAtEnd?: string; // 수정일시 종료
	updatedBy?: string; // 수정자
	id?: number; // ID
	commandId?: number; // 작업지시 ID
	itemId?: number; // 아이템 ID
	lotNo?: string; // LOT 번호
	itemNo?: number; // 아이템 번호
	itemNumber?: string; // 품번
	itemName?: string; // 품명
	itemSpec?: string; // 규격
	lotAmount?: number; // LOT 수량
	lotWeight?: number; // LOT 중량
	restAmount?: number; // 잔여 수량
	restWeight?: number; // 잔여 중량
}

// Lot 목록 요청 파라미터
export interface LotListParams {
	searchRequest?: LotSearchRequest;
	page?: number;
	size?: number;
}

// Lot 조건부 검색 목록 요청 파라미터
export interface LotSearchWithConditionsParams {
	searchRequest?: LotSearchWithConditionsRequest;
	page?: number;
	size?: number;
}
