// Production Plan 관련 타입 정의 (Swagger 기반)

// Plan Master 인터페이스
export interface PlanMaster {
	id: number;
	accountMon: string; // 회계년월
	planCode: string; // 계획 코드
	planSeq?: number; // 계획코드 시퀀스
	itemId?: number; // 품목 ID
	itemNo?: number; // 품목 번호
	itemNumber?: string; // 품번
	itemName?: string; // 품명
	itemSpec?: string; // 규격
	planQuantity?: number; // 계획 수량
	planType?: string; // 계획 유형
	planTypeValue?: string; // 계획 유형 값
	vendorOrderCode?: string; // 사용자 주문 코드
	status?: string; // 상태
	statusValue?: string; // 상태 값
	itemUnit?: string; // 품목 단위
	createdAt?: string;
	updatedAt?: string;
}

// Plan 타입 (호환성을 위한 별칭)
export interface Plan extends PlanMaster {}

// Plan 생성 Payload
export interface CreatePlanPayload {
	accountMon: string; // 회계년월 (필수)
	itemId?: number; // 품목 ID
	itemNo?: number; // 품목 번호
	itemNumber?: string; // 품번
	itemName?: string; // 품명
	itemSpec?: string; // 규격
	planQuantity?: number; // 계획 수량
	planType?: string; // 계획 유형
	vendorOrderCode?: string; // 사용자 주문 코드
	status?: string; // 상태
	itemUnit?: string; // 품목 단위
}

// Plan 수정 Payload (planCode 제외)
export interface UpdatePlanPayload {
	accountMon?: string; // 회계년월
	itemId?: number; // 품목 ID
	itemNo?: number; // 품목 번호
	itemNumber?: string; // 품번
	itemName?: string; // 품명
	itemSpec?: string; // 규격
	planQuantity?: number; // 계획 수량
	planType?: string; // 계획 유형
	vendorOrderCode?: string; // 사용자 주문 코드
	status?: string; // 상태
	itemUnit?: string; // 품목 단위
}

// Plan 검색 요청 (Swagger 기반)
export interface PlanSearchRequest {
	accountMon?: string; // 회계년월
	planCode?: string; // 계획 코드
	planType?: string; // 계획 유형
	itemNumber?: string; // 품목 번호
	status?: string; // 상태
}
