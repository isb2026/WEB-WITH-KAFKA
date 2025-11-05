// Swagger-based Vendor Types

// VendorSearchRequest - Vendor 검색 요청
export interface VendorSearchRequest {
	isUse?: boolean; // 사용 여부
	createdAtStart?: string; // 생성일시 시작
	createdAtEnd?: string; // 생성일시 종료
	createdBy?: string; // 생성자
	updatedAtStart?: string; // 수정일시 시작
	updatedAtEnd?: string; // 수정일시 종료
	updatedBy?: string; // 수정자
	id?: number; // ID
	compCode?: string; // Comp code
	compType?: string; // Comp type
	licenseNo?: string; // License no
	compName?: string; // Comp name
	ceoName?: string; // Ceo name
	compEmail?: string; // Comp email
	telNumber?: string; // Tel number
	faxNumber?: string; // Fax number
	zipCode?: string; // Zip code
	addressDtl?: string; // Address dtl
	addressMst?: string; // Address mst
}

// VendorCreateRequest - Vendor Create 요청
export interface VendorCreateRequest {
	isUse?: boolean; // 사용 여부
	compCode?: string; // Comp code
	compType?: string; // Comp type
	licenseNo?: string; // License no
	compName?: string; // Comp name
	ceoName?: string; // Ceo name
	compEmail?: string; // Comp email
	telNumber?: string; // Tel number
	faxNumber?: string; // Fax number
	businessType?: string; // Business type
	industry?: string; // Industry
	zipCode?: string; // Zip code
	addressDtl?: string; // Address dtl
	addressMst?: string; // Address mst
	memo?: string; // Memo
	usageStatus?: string; // Usage status
	attachments?: any[]; // Attachments
}

// VendorListCreateRequest - Vendor 리스트 Create 요청
export interface VendorListCreateRequest {
	dataList: VendorCreateRequest[]; // 생성할 Vendor 데이터 리스트
}

// VendorUpdateRequest - Vendor Update 요청
export interface VendorUpdateRequest {
	isUse?: boolean; // 사용여부
	compCode?: string; // Comp code
	compType?: string; // Comp type
	licenseNo?: string; // License no
	compName?: string; // Comp name
	ceoName?: string; // Ceo name
	compEmail?: string; // Comp email
	telNumber?: string; // Tel number
	faxNumber?: string; // Fax number
	zipCode?: string; // Zip code
	addressDtl?: string; // Address dtl
	addressMst?: string; // Address mst
}

// VendorUpdateAllRequest - Vendor 일괄 Update 요청
export interface VendorUpdateAllRequest {
	id: number; // ID
	isUse?: boolean; // 사용여부
	compCode?: string; // Comp code
	compType?: string; // Comp type
	licenseNo?: string; // License no
	compName?: string; // Comp name
	ceoName?: string; // Ceo name
	compEmail?: string; // Comp email
	telNumber?: string; // Tel number
	faxNumber?: string; // Fax number
	zipCode?: string; // Zip code
	addressDtl?: string; // Address dtl
	addressMst?: string; // Address mst
}

// VendorDto - Vendor 응답 데이터
export interface VendorDto {
	id: number;
	tenantId: number;
	isDelete: boolean;
	isUse: boolean;
	compCode: string;
	compType: string;
	licenseNo: string;
	compName: string;
	ceoName: string;
	compEmail: string;
	telNumber: string;
	faxNumber: string;
	zipCode: string;
	addressDtl: string;
	addressMst: string;
	createdBy: string;
	createdAt: string; // ISO date string
	updatedBy: string;
	updatedAt: string; // ISO date string
	itemProgress: ItemProgressDto[];
}

// ItemProgressDto (referenced in VendorDto)
export interface ItemProgressDto {
	id: number;
	tenantId: number;
	isDelete: boolean;
	isUse: boolean;
	accountYear: number;
	itemId: number;
	item?: any; // ItemDto
	progressOrder: number;
	progressName: string;
	isOutsourcing: boolean;
	vendorId: number;
	vendor?: VendorDto;
	unitCost: number;
	createdBy: string;
	createdAt: string;
	updatedBy: string;
	updatedAt: string;
}

// Legacy types for backward compatibility
export interface GetAllVendorListPayload {
	page: number;
	size: number;
	searchRequest?: VendorSearchRequest;
}

export interface GetSearchVendorListPayload {
	page: number;
	size: number;
	searchRequest: VendorSearchRequest;
}

export interface createVendorPayload extends VendorCreateRequest {}
export interface updateVendorPayload extends VendorUpdateRequest {}
export interface SearchVendorRequest extends VendorSearchRequest {}
export interface Vendor extends Omit<VendorDto, 'itemProgress'> {
	itemProgress: unknown[];
}
