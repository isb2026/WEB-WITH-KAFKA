// 주문 상태 열거형
export enum OrderStatus {
	RECEIVED = 'RECEIVED',           // 접수
	MATERIAL_CHECK = 'MATERIAL_CHECK', // 소재 확인
	WORK_ORDER = 'WORK_ORDER',       // 작업 지시
	IN_PROGRESS = 'IN_PROGRESS',     // 진행 중
	QUALITY_CHECK = 'QUALITY_CHECK', // 품질 검사
	COMPLETED = 'COMPLETED',         // 완료
	SHIPPED = 'SHIPPED',             // 출하
	DELIVERED = 'DELIVERED',         // 배송 완료
}

// 우선순위 열거형
export enum Priority {
	LOW = 'LOW',           // 낮음
	MEDIUM = 'MEDIUM',     // 보통
	HIGH = 'HIGH',         // 높음
	URGENT = 'URGENT',     // 긴급
}

// 외주 주문 마스터
export interface OutsourcingOrderMaster {
	id: string;
	orderNumber: string;           // 주문번호
	customerName: string;          // 발주업체명
	customerCode?: string;         // 발주업체 코드
	orderDate: Date;              // 주문일자
	dueDate: Date;                // 납기일자
	status: OrderStatus;          // 주문상태
	priority: Priority;           // 우선순위
	totalAmount: number;          // 총 금액
	currency: string;             // 통화
	memo?: string;                // 메모
	createdAt: Date;              // 생성일시
	updatedAt: Date;              // 수정일시
}

// 외주 주문 상세
export interface OutsourcingOrderDetail {
	id: string;
	orderMasterId: string;        // 주문 마스터 ID
	materialId: string;           // 소재 ID
	materialName: string;         // 소재명
	materialSpec: string;         // 소재 규격
	materialCode?: string;        // 소재 코드
	quantity: number;             // 수량
	unit: string;                 // 단위
	unitPrice: number;            // 단가
	totalPrice: number;           // 총 가격
	processType: string;          // 가공 유형
	processSpec: string;          // 가공 사양
	assignedPartner?: string;     // 할당된 협력업체
	partnerCode?: string;         // 협력업체 코드
	progress: OrderStatus;        // 진행상태
	startDate?: Date;             // 시작일
	completionDate?: Date;        // 완료일
	memo?: string;                // 메모
}

// 주문 검색 조건
export interface OrderSearchRequest {
	orderNumber?: string;
	customerName?: string;
	status?: OrderStatus;
	priority?: Priority;
	orderDateFrom?: Date;
	orderDateTo?: Date;
	dueDateFrom?: Date;
	dueDateTo?: Date;
}

// 주문 생성 요청
export interface CreateOrderRequest {
	customerName: string;
	customerCode?: string;
	orderDate: Date;
	dueDate: Date;
	priority: Priority;
	currency: string;
	memo?: string;
	details: CreateOrderDetailRequest[];
}

// 주문 상세 생성 요청
export interface CreateOrderDetailRequest {
	materialName: string;
	materialSpec: string;
	materialCode?: string;
	quantity: number;
	unit: string;
	unitPrice: number;
	processType: string;
	processSpec: string;
	memo?: string;
}

// 주문 수정 요청
export interface UpdateOrderRequest {
	customerName?: string;
	customerCode?: string;
	orderDate?: Date;
	dueDate?: Date;
	priority?: Priority;
	currency?: string;
	memo?: string;
}

// 주문 상세 수정 요청
export interface UpdateOrderDetailRequest {
	materialName?: string;
	materialSpec?: string;
	materialCode?: string;
	quantity?: number;
	unit?: string;
	unitPrice?: number;
	processType?: string;
	processSpec?: string;
	memo?: string;
}

// 주문 목록 응답
export interface OrderListResponse {
	content: OutsourcingOrderMaster[];
	totalElements: number;
	totalPages: number;
	size: number;
	number: number;
}

// 주문 상세 목록 응답
export interface OrderDetailListResponse {
	content: OutsourcingOrderDetail[];
	totalElements: number;
	totalPages: number;
	size: number;
	number: number;
}
