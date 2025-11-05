// Mold 관련 타입 정의

// MoldDisposeSearchRequest 타입
export interface MoldDisposeSearchRequest {
	description?: string;
	reduceNum?: number;
	createdAtEnd?: string;
	commandId?: number;
	createdAtStart?: string;
	progressId?: number;
	updatedAtEnd?: string;
	itemId?: number;
	useName?: string;
	updatedBy?: string;
	machineName?: string;
	reduceDate?: string;
	updatedAtStart?: string;
	moldMasterId?: number;
	id?: number;
	createdBy?: string;
}

// MoldGradeSearchRequest 타입
export interface MoldGradeSearchRequest {
	description?: string;
	createdAtEnd?: string;
	method?: string;
	regularPeriodUnit?: string;
	color?: string;
	max?: number;
	createdAtStart?: string;
	updatedAtEnd?: string;
	order?: number;
	min?: number;
	updatedBy?: string;
	updatedAtStart?: string;
	gradeStandard?: string;
	regularType?: string;
	grade?: string;
	id?: number;
	regularPeriod?: number;
	createdBy?: string;
}

// MoldGradeCreateRequest 타입
export interface MoldGradeCreateRequest {
	grade: string;
	method: string;
	gradeOrder: number; // API example shows 'gradeOrder'
	min: number; // Made required to match API example
	max: number; // Made required to match API example
	color: string; // Made required to match API example
	gradeStandard: string; // Made required to match API example
	regularType: string; // Made required to match API example
	regularPeriodUnit: string; // Made required to match API example
	regularPeriod: number; // Made required to match API example
}

// MoldGradeListCreateRequest 타입
export interface MoldGradeListCreateRequest {
	dataList: MoldGradeCreateRequest[];
}

// MoldGradeDto 타입
export interface MoldGradeDto {
	id: number;
	tenantId: number;
	isDelete: boolean;
	isUse: boolean;
	grade: string;
	method: string;
	gradeOrder: number; // Updated to match API (was 'order')
	min: number;
	max: number;
	color: string;
	gradeStandard: string;
	regularType: string;
	regularPeriodUnit: string;
	regularPeriod: number;
	createdBy: string;
	createdAt: string;
	updatedBy: string;
	updatedAt: string;
}

// MoldInoutInformationSearchRequest 타입
export interface MoldInoutInformationSearchRequest {
	moldInstanceId?: number;
	outItemName?: string;
	outItemNo?: number;
	outMachineName?: string;
	outCommandNo?: string;
	outProgressName?: string;
	inOutDate?: string;
	inoutFlag?: boolean;
	stock?: number;
	isUse?: boolean;
	createBy?: string;
	page?: number;
	size?: number;
	sort?: string;
	direction?: string;
}

// MoldInoutInformationCreateRequest 타입
export interface MoldInoutInformationCreateRequest {
	moldInstanceId: number;
	moldLocationId: number;
	stock: number;
	inOutDate: string;
	inoutFlag: boolean;
	outMachineId: number;
	outMachineName: string;
	outCommandId: number;
	outCommandNo: string;
	outItemId: number;
	outItemNo: number;
	outItemName: string;
	outProgressId: number;
	outProgressName: string;
}

// MoldInoutInformationListCreateRequest 타입
export interface MoldInoutInformationListCreateRequest {
	dataList: MoldInoutInformationCreateRequest[];
}

// 새로운 금형 투입 API 타입
export interface MoldInstanceInputRequest {
	moldInstanceIds: number[];
	moldLocationId: number;
	inputDate: string; // LocalDate는 "YYYY-MM-DD" 형식의 문자열로 전송
	outMachineId?: number; // Optional in Java
	outMachineName?: string; // Optional in Java
	outCommandId?: number; // Optional in Java
	outCommandNo?: string; // Optional in Java
	outItemId?: number; // Optional in Java
	outItemNo?: number; // Short in Java, but number works
	outItemName?: string; // Optional in Java
	outProgressId?: number; // Optional in Java
	outProgressName?: string; // Optional in Java
	stock?: number; // Short in Java with default value 1
}

// 새로운 금형 회수 API 타입 (단순 ID 배열)
export type MoldInstanceCollectRequest = number[];

// MoldInstanceSearchRequest 타입
export interface MoldInstanceSearchRequest {
	description?: string;
	createdAtEnd?: string;
	progTypeCode?: string;
	keepPlace?: string;
	excAggre?: string;
	moldCode?: string;
	createdAtStart?: string;
	firstPunchNum?: number;
	endDt?: string;
	capacityNum?: number;
	moldInstanceStandard?: string;
	updatedAtEnd?: string;
	cost?: number;
	itemId?: number;
	isManage?: boolean;
	isSubMold?: boolean;
	isEnd?: boolean;
	updatedBy?: string;
	status?: string;
	isPublic?: boolean;
	inDate?: string;
	updatedAtStart?: string;
	ownComp?: number;
	moldLife?: number;
	series?: number;
	moldMasterId?: number;
	grade?: string;
	moldInstanceNumber?: string;
	moldInstanceName?: string;
	moldInId?: number;
	id?: number;
	moldInstanceCode?: string;
	currentStock?: number;
	moldVendorId?: number;
	isUse?: boolean;
	isAutoGrade?: boolean;
	createdBy?: string;
	endReason?: string;
	isInput?: boolean;
}

// MoldInstanceCreateRequest 타입
export interface MoldInstanceCreateRequest {
	moldInstanceCode: string;
	moldMasterId?: number;
	itemId?: number;
	inDate?: string;
	series?: number;
	progTypeCode: string;
	moldCode?: string;
	moldInstanceName?: string;
	moldInstanceNumber?: string;
	moldInstanceStandard?: string;
	moldLife?: number;
	moldVendorId?: number;
	keepPlace?: string;
	cost?: number;
	isEnd?: boolean;
	endDt?: string;
	endReason?: string;
	firstPunchNum?: number;
	grade: string;
	isAutoGrade?: boolean;
	currentStock?: number;
	isManage?: boolean;
	isPublic?: boolean;
	ownComp?: number;
	moldInId?: number;
	excAggre?: string;
	capacityNum?: number;
	isSubMold?: boolean;
	status?: string;
}

// MoldInstanceListCreateRequest 타입
export interface MoldInstanceListCreateRequest {
	dataList: MoldInstanceCreateRequest[];
}

// MoldItemRelationSearchRequest 타입
export interface MoldItemRelationSearchRequest {
	description?: string;
	createdAtEnd?: string;
	createdAtStart?: string;
	updatedAtEnd?: string;
	itemId?: number;
	itemStandard?: string;
	updatedBy?: string;
	itemNo?: number;
	updatedAtStart?: string;
	moldMasterId?: number;
	progressName?: string;
	id?: number;
	itemProgressId?: number;
	itemNumber?: string;
	isUse?: boolean;
	itemName?: string;
	createdBy?: string;
}

// MoldItemRelationCreateRequest 타입
export interface MoldItemRelationCreateRequest {
	moldMasterId?: number;
	itemId?: number;
	itemNo?: number;
	itemName?: string;
	itemNumber?: string;
	itemStandard?: string;
	itemProgressId?: number;
	progressName: string;
}

// MoldItemRelationListCreateRequest 타입
export interface MoldItemRelationListCreateRequest {
	dataList: MoldItemRelationCreateRequest[];
}

// MoldRepairSearchRequest 타입
export interface MoldRepairSearchRequest {
	description?: string;
	createdAtEnd?: string;
	admitName?: string;
	endRequestDate?: string;
	admitTime?: string;
	closeName?: string;
	moldNumber?: string;
	moldName?: string;
	closeTime?: string;
	repairContents?: string;
	moldCode?: string;
	createdAtStart?: string;
	moldInstanceId?: number;
	isAdmit?: boolean;
	previousMoldLife?: number;
	updatedAtEnd?: string;
	cost?: number;
	isClose?: boolean;
	repairPicture?: string;
	isEnd?: boolean;
	updatedBy?: string;
	afterMoldLife?: number;
	accountMonth?: string;
	inDate?: string;
	updatedAtStart?: string;
	moldStandard?: string;
	inMonth?: string;
	id?: number;
	outDate?: string;
	moldVendorId?: number;
	isUse?: boolean;
	createdBy?: string;
}

// MoldRepairCreateRequest 타입
export interface MoldRepairCreateRequest {
	moldInstanceId?: number;
	moldCode?: string;
	moldName?: string;
	moldNumber?: string;
	moldStandard?: string;
	outDate?: string;
	inDate?: string;
	cost?: number;
	isEnd?: boolean;
	moldVendorId?: number;
	repairContents?: string;
	accountMonth?: string;
	inMonth?: string;
	isClose?: boolean;
	closeName?: string;
	closeTime?: string;
	isAdmit?: boolean;
	admitName?: string;
	admitTime?: string;
	repairPicture?: string;
	endRequestDate?: string;
	previousMoldLife?: number;
	afterMoldLife?: number;
}

// MoldRepairListCreateRequest 타입
export interface MoldRepairListCreateRequest {
	dataList: MoldRepairCreateRequest[];
}

// MoldPriceChangeHistorySearchRequest 타입
export interface MoldPriceChangeHistorySearchRequest {
	description?: string;
	createdAtEnd?: string;
	vendorId?: number;
	createdAtStart?: string;
	progressId?: number;
	updatedAtEnd?: string;
	itemId?: number;
	moldPrice?: string;
	updatedBy?: string;
	updatedAtStart?: string;
	moldMasterId?: number;
	id?: number;
	applyDate?: string;
	isUse?: boolean;
	createdBy?: string;
}

// MoldPriceChangeHistoryCreateRequest 타입
export interface MoldPriceChangeHistoryCreateRequest {
	moldMasterId?: number;
	vendorId?: number;
	itemId?: number;
	progressId?: number;
	moldPrice: string;
	applyDate?: string;
}

// MoldPriceChangeHistoryListCreateRequest 타입
export interface MoldPriceChangeHistoryListCreateRequest {
	dataList: MoldPriceChangeHistoryCreateRequest[];
}

// MoldOrderIngoingSearchRequest 타입
export interface MoldOrderIngoingSearchRequest {
	description?: string;
	createdAtEnd?: string;
	moldOrderDetailId?: number;
	inNum?: number;
	inPrice?: number;
	createdAtStart?: string;
	auditDate?: string;
	isDev?: boolean;
	updatedAtEnd?: string;
	auditBy?: string;
	updatedBy?: string;
	accountMonth?: string;
	inDate?: string;
	updatedAtStart?: string;
	isChange?: boolean;
	inMonth?: string;
	isPass?: boolean;
	id?: number;
	inAmount?: number;
	isUse?: boolean;
	moldSheetImg?: string;
	createdBy?: string;
}

// MoldOrderIngoingCreateRequest 타입
export interface MoldOrderIngoingCreateRequest {
	moldOrderDetailId: number; // Required (NotNull)
	accountMonth?: string; // Optional, max 6 chars
	inDate?: Date | string; // Optional, LocalDate
	inMonth?: string; // Optional, max 6 chars
	inNum: number; // Required (NotNull), Short type (0-65535)
	inPrice: number; // Required (NotNull), Integer type (min 0)
	inAmount?: number; // Optional, Integer type
	placeName: string; // Required (NotNull)
	isDev?: boolean; // Optional, Boolean
	isChange?: boolean; // Optional, Boolean
	auditBy?: string; // Optional, max 10 chars
	auditDate?: Date | string | null; // Optional, LocalDate
	isPass?: boolean; // Optional, Boolean
	moldSheetImg?: string; // Optional, max 50 chars
}

// MoldOrderIngoingListCreateRequest 타입
export interface MoldOrderIngoingListCreateRequest {
	dataList: MoldOrderIngoingCreateRequest[];
}

// MoldLocationSearchRequest 타입
export interface MoldLocationSearchRequest {
	description?: string;
	createdAtEnd?: string;
	createdAtStart?: string;
	moldInstanceId?: number;
	updatedAtEnd?: string;
	isExist?: boolean;
	isManage?: boolean;
	placeName?: string;
	updatedBy?: string;
	updatedAtStart?: string;
	inOutDate?: string;
	moldMasterId?: number;
	id?: number;
	currentStock?: number;
	isUse?: boolean;
	createdBy?: string;
}

// MoldLocationCreateRequest 타입
export interface MoldLocationCreateRequest {
	moldMasterId?: number;
	moldInstanceId?: number;
	placeName: string;
	isManage?: boolean;
	currentStock?: number;
	inOutDate?: string;
	isExist?: boolean;
}

// MoldLocationListCreateRequest 타입
export interface MoldLocationListCreateRequest {
	dataList: MoldLocationCreateRequest[];
}

// MoldUsingInformationSearchRequest 타입
export interface MoldUsingInformationSearchRequest {
	description?: string;
	createdAtEnd?: string;
	commandId?: number;
	num?: number;
	createdAtStart?: string;
	workerName?: string;
	moldInstanceId?: number;
	commandNo?: string;
	updatedAtEnd?: string;
	updatedBy?: string;
	machineName?: string;
	updatedAtStart?: string;
	moldMasterId?: number;
	jobId?: number;
	id?: number;
	moldInstanceCode?: string;
	workCode?: string;
	createdBy?: string;
	workDate?: string;
}

// MoldUsingInformationCreateRequest 타입
export interface MoldUsingInformationCreateRequest {
	moldInstanceId?: number;
	commandId?: number;
	commandNo: string;
	moldInstanceCode: string;
	moldMasterId?: number;
	jobId?: number;
	num?: number;
	workerName?: string;
	machineName?: string;
	workDate?: string;
	workCode?: string;
}

// MoldUsingInformationListCreateRequest 타입
export interface MoldUsingInformationListCreateRequest {
	dataList: MoldUsingInformationCreateRequest[];
}

// MoldLifeChangeHistorySearchRequest 타입
export interface MoldLifeChangeHistorySearchRequest {
	description?: string;
	createdAtEnd?: string;
	qcCheckDate?: string;
	createdAtStart?: string;
	updatedAtEnd?: string;
	updatedBy?: string;
	updatedAtStart?: string;
	qcCheck?: string;
	moldMasterId?: number;
	afterLife?: number;
	id?: number;
	beforeLife?: number;
	qcName?: string;
	createdBy?: string;
}

// MoldLifeChangeHistoryCreateRequest 타입
export interface MoldLifeChangeHistoryCreateRequest {
	moldMasterId?: number;
	beforeLife?: number;
	afterLife?: number;
	qcCheck?: string;
	qcName?: string;
	qcCheckDate?: string;
}

// MoldLifeChangeHistoryListCreateRequest 타입
export interface MoldLifeChangeHistoryListCreateRequest {
	dataList: MoldLifeChangeHistoryCreateRequest[];
}

// MoldMasterSearchRequest 타입
export interface MoldMasterSearchRequest {
	createdAtEnd?: string;
	keepPlace?: string;
	moldPicture?: string;
	moldName?: string;
	moldDesignCode?: string;
	moldCode?: string;
	createdAtStart?: string;
	safeStock?: number;
	lifeCycle?: number;
	updatedAtEnd?: string;
	moldPrice?: number;
	updatedBy?: string;
	moldType?: string;
	updatedAtStart?: string;
	moldStandard?: string;
	moldDesign?: string;
	id?: number;
	currentStock?: number;
	isUse?: boolean;
	createdBy?: string;
	manageType?: string;
}

// MoldMasterCreateRequest 타입
export interface MoldMasterCreateRequest {
	moldType: string;
	moldCode: string;
	moldName: string;
	moldStandard: string;
	lifeCycle: number; // ✅ Now REQUIRED (was optional)
	moldPrice: number; // ✅ Now REQUIRED (was optional)
	safeStock?: number;
	currentStock?: number;
	manageType: string;
	moldDesign?: string;
	moldDesignCode?: string;
	moldPicture?: string;
	keepPlace?: string;
}

// MoldMasterUpdateRequest 타입 (NEW)
export interface MoldMasterUpdateRequest {
	isUse?: boolean; // NEW - for enable/disable functionality
	moldType?: string;
	moldCode?: string;
	moldName?: string;
	moldStandard?: string;
	lifeCycle?: number;
	moldPrice?: number;
	safeStock?: number;
	currentStock?: number;
	manageType?: string;
	moldDesign?: string;
	moldDesignCode?: string;
	moldPicture?: string;
	keepPlace?: string;
}

// MoldDisposeDto 타입
export interface MoldDisposeCreateRequest {
	moldMasterId: number;
	itemId: number;
	progressId: number;
	commandId: number;
	machineName: string;
	reduceDate: string;
	reduceNum: number;
	useName: string;
}



export interface MoldDisposeDto {
	id: number;
	tenantId: number;
	isDelete: boolean;
	moldMasterId: number;
	moldMaster: string;
	itemId: number;
	progressId: number;
	commandId: number;
	machineName: string;
	reduceDate: string;
	reduceNum: number;
	useName: string;
	createdBy: string;
	createdAt: string;
	updatedBy: string;
	updatedAt: string;
}

// MoldItemRelationDto 타입
export interface MoldItemRelationDto {
	id: number;
	tenantId: number;
	isDelete: boolean;
	isUse: boolean;
	moldMasterId: number;
	moldMaster: string;
	itemId: number;
	itemNo: number;
	itemName: string;
	itemNumber: string;
	itemStandard: string;
	itemProgressId: number;
	progressName: string;
	createdBy: string;
	createdAt: string;
	updatedBy: string;
	updatedAt: string;
}

// MoldLifeChangeHistoryDto 타입
export interface MoldLifeChangeHistoryDto {
	id: number;
	tenantId: number;
	isDelete: boolean;
	moldMasterId: number;
	moldMaster: string;
	beforeLife: number;
	afterLife: number;
	qcCheck: string;
	qcName: string;
	qcCheckDate: string;
	createdBy: string;
	createdAt: string;
	updatedBy: string;
	updatedAt: string;
}

// MoldLocationDto 타입 (API 응답에 맞게 업데이트)
export interface MoldLocationDto {
	id: number;
	tenantId: number;
	isDelete: boolean;
	isUse: boolean;
	moldMasterId: number;
	moldMaster: MoldMasterDto | null;
	moldInstanceId: number;
	moldInstance: MoldInstanceDto | null;
	placeName: string;
	currentStock: number;
	inOutDate: string;
	isExist: boolean;
	createdBy: string;
	createdAt: string;
	updatedBy: string;
	updatedAt: string;
}

// MoldOrderIngoingDto 타입
export interface MoldOrderIngoingDto {
	id: number;
	tenantId: number;
	isDelete: boolean;
	isUse: boolean;
	moldOrderDetailId: number;
	moldOrderDetail: string;
	accountMonth: string;
	inDate: string;
	inMonth: string;
	inNum: number;
	inPrice: number;
	inAmount: number;
	isDev: boolean;
	isChange: boolean;
	auditBy: string;
	auditDate: string;
	isPass: boolean;
	moldSheetImg: string;
	createdBy: string;
	createdAt: string;
	updatedBy: string;
	updatedAt: string;
}

// MoldOrderMaster Types
export interface MoldOrderMasterSearchRequest {
	createdAtEnd?: string;
	admitName?: string;
	admitTime?: string;
	closeName?: string;
	closeTime?: string;
	createdAtStart?: string;
	progressId?: number;
	endDate?: string;
	isAdmit?: boolean;
	isDev?: boolean;
	updatedAtEnd?: string;
	isClose?: boolean;
	itemId?: number;
	isEnd?: boolean;
	updatedBy?: string;
	accountMonth?: string;
	moldType?: string;
	updatedAtStart?: string;
	inRequestDate?: string;
	progressName?: string;
	isChange?: boolean;
	id?: number;
	orderCode?: string;
	orderDate?: string;
	moldVendorId?: number;
	isUse?: boolean;
	createdBy?: string;
	inType?: string;
}

export interface MoldOrderMasterCreateRequest {
	accountMonth: string;
	orderDate: string;
	itemId: number;
	progressId: number;
	progressName: string;
	inRequestDate: string;
	moldVendorId: number;
	isDev: boolean;
	isChange: boolean;
	isEnd: boolean;
	endDate: string;
	isClose: boolean;
	closeName: string;
	closeTime: string;
	isAdmit: boolean;
	admitName: string;
	admitTime: string;
	moldType: string;
	inType: string;
}

export interface MoldOrderMasterDto {
	id: number;
	tenantId: number;
	isDelete: boolean;
	isUse: boolean;
	orderCode: string;
	accountMonth: string;
	orderDate: string;
	itemId: number;
	progressId: number;
	progressName: string;
	inRequestDate: string;
	moldVendorId: number;
	isDev: boolean;
	isChange: boolean;
	isEnd: boolean;
	endDate: string;
	isClose: boolean;
	closeName: string;
	closeTime: string;
	isAdmit: boolean;
	admitName: string;
	admitTime: string;
	moldType: string;
	inType: string;
	createdBy: string;
	createdAt: string;
	updatedBy: string;
	updatedAt: string;
}

// MoldOrderDetail Types
export interface MoldOrderDetailSearchRequest {
	description?: string;
	createdAtEnd?: string;
	inNum?: number;
	inPrice?: number;
	orderAmount?: number;
	num?: number;
	createdAtStart?: string;
	progressId?: number;
	ownVendorId?: number;
	isDev?: boolean;
	updatedAtEnd?: string;
	itemId?: number;
	isIn?: boolean;
	moldOrderMasterId?: number;
	updatedBy?: string;
	orderMonth?: string;
	accountMonth?: string;
	inDate?: string;
	updatedAtStart?: string;
	moldMasterId?: number;
	isChange?: boolean;
	inMonth?: string;
	id?: number;
	orderPrice?: number;
	inAmount?: number;
	isUse?: boolean;
	createdBy?: string;
	vendorId?: number;
}

export interface MoldOrderDetailCreateRequest {
	orderMonth: string;
	accountMonth: string;
	itemId: number;
	inDate: string;
	moldOrderMasterId: number;
	moldMasterId: number;
	progressId: number;
	inMonth: string;
	num: number;
	orderPrice: number;
	isIn: boolean;
	orderAmount: number;
	vendorId: number;
	vendorName: string;
}

export interface MoldOrderDetailDto {
	id: number;
	tenantId: number;
	isDelete: boolean;
	isUse: boolean;
	orderMonth: string;
	accountMonth: string;
	itemId: number;
	inDate: string;
	moldOrderMasterId: number;
	moldMasterId: number;
	moldMaster?: {
		id: number;
		moldCode: string;
		moldName: string;
		moldStandard: string;
	};
	progressId: number;
	inMonth: string;
	num: number;
	orderPrice: number;
	isIn: boolean;
	orderAmount: number;
	vendorId: number;
	vendorName: string;
	isDev: boolean;
	isChange: boolean;
	createdBy: string;
	createdAt: string;
	updatedBy: string;
	updatedAt: string;
}

// Note: MoldOrderDetail types are defined above in the MoldOrderDetail Types section

// MoldPriceChangeHistoryDto 타입
export interface MoldPriceChangeHistoryDto {
	id: number;
	tenantId: number;
	isDelete: boolean;
	isUse: boolean;
	moldMasterId: number;
	moldMaster: string;
	vendorId: number;
	itemId: number;
	progressId: number;
	moldPrice: number;
	applyDate: string;
	createdBy: string;
	createdAt: string;
	updatedBy: string;
	updatedAt: string;
}

// MoldSetMasterDto 타입
export interface MoldSetMasterDto {
	id: number;
	tenantId: number;
	isDelete: boolean;
	isUse: boolean;
	itemId: number;
	itemNo: number;
	itemNumber: string;
	itemName: string;
	itemSpec: string;
	progressId: number;
	machineId: number;
	moldSetCode: string;
	moldSetName: string;
	moldSetDate: string | null;
	place: string | null;
	isDefault: boolean;
	refItemId: number | null;
	refProgressId: number | null;
	machineName: string;
	moldBomMasterId: number;
	createdBy: string;
	createdAt: string;
	updatedBy: string;
	updatedAt: string;
	moldSetDetails: MoldSetDetailDto[];
}

// MoldSetDetailDto 타입
export interface MoldSetDetailDto {
	id: number;
	tenantId: number;
	isDelete: boolean;
	isUse: boolean;
	moldSetMasterId: number;
	moldSetMaster: MoldSetMasterDto | null;
	moldInstanceId: number;
	moldInstance: MoldInstanceDto | null;
	createdBy: string;
	createdAt: string;
	updatedBy: string;
	updatedAt: string;
}

// MoldRepairDto 타입
export interface MoldRepairDto {
	id: number;
	tenantId: number;
	isDelete: boolean;
	isUse: boolean;
	moldInstanceId: number;
	moldInstance: string;
	moldCode: string;
	moldName: string;
	moldNumber: string;
	moldStandard: string;
	outDate: string;
	inDate: string;
	cost: number;
	isEnd: boolean;
	moldVendorId: number;
	repairContents: string;
	accountMonth: string;
	inMonth: string;
	isClose: boolean;
	closeName: string;
	closeTime: string;
	isAdmit: boolean;
	admitName: string;
	admitTime: string;
	repairPicture: string;
	endRequestDate: string;
	previousMoldLife: number;
	afterMoldLife: number;
	createdBy: string;
	createdAt: string;
	updatedBy: string;
	updatedAt: string;
}

// MoldInoutInformationDto 타입
export interface MoldInoutInformationDto {
	id: number;
	moldLocationId: number;
	tenantId: number;
	isDelete: boolean;
	isUse: boolean;
	moldInstanceId: number;
	moldInstance: any;
	stock: number;
	inOutDate: string;
	inoutFlag: boolean;
	outMachineId: number;
	outMachineName: string;
	outCommandId: number;
	outCommandNo: string;
	outItemId: number;
	outItemNo: number;
	outItemName: string;
	outProgressId: number | null;
	outProgressName: string;
	createBy: string;
	createAt: string;
	updateBy: string;
	updateAt: string;
}

// MoldMasterDto 타입
export interface MoldMasterDto {
	id: number;
	tenantId: number;
	isDelete: boolean;
	isUse: boolean;
	moldType: string;
	moldCode: string;
	moldName: string;
	moldStandard: string;
	lifeCycle: number;
	moldPrice: number;
	safeStock: number;
	currentStock: number;
	manageType: string;
	moldDesign: string;
	moldDesignCode: string;
	moldPicture: string;
	keepPlace: string;
	createdBy: string;
	createdAt: string;
	updatedBy: string;
	updatedAt: string;
	moldDisposes: MoldDisposeDto[];
	moldInstances: string[];
	moldItemRelations: MoldItemRelationDto[];
	moldLifeChangeHistorys: MoldLifeChangeHistoryDto[];
	moldLocations: MoldLocationDto[];
	moldOrderDetails: MoldOrderDetailDto[];
	moldPriceChangeHistorys: MoldPriceChangeHistoryDto[];
	moldUsingInformations: string[];
}



// MoldUsingInformationDto 타입
export interface MoldUsingInformationDto {
	id: number;
	tenantId: number;
	isDelete: boolean;
	moldInstanceId: number;
	moldInstance: MoldInstanceDto;
	commandId: number;
	commandNo: string;
	moldInstanceCode: string;
	moldMasterId: number;
	moldMaster: MoldMasterDto;
	jobId: number;
	num: number;
	workerName: string;
	machineName: string;
	workDate: string;
	workCode: string;
	createdBy: string;
	createdAt: string;
	updatedBy: string;
	updatedAt: string;
}

// CommonResponseListMoldUsingInformationDto 타입
export interface CommonResponseListMoldUsingInformationDto {
	status: string;
	data: MoldUsingInformationDto[];
	message: string;
}

// MoldBom 관련 타입들
export interface MoldBomMasterDto {
	id: number;
	tenantId: number;
	isDelete: boolean;
	isUse: boolean;
	itemId: number;
	itemNo: number;
	itemNumber: string;
	itemName: string;
	itemSpec: string;
	itemCode: string;
	progressId: number;
	progressTypeCode: string;
	progressCode: string;
	progressName: string;
	machineId: number;
	machineName: string;
	machineCode: string;
	moldBomDetail: MoldBomDetailDto[];
	createdBy: string;
	createdAt: string;
	updatedBy: string;
	updatedAt: string;
}

export interface MoldBomDetailDto {
	id: number;
	tenantId: number;
	isDelete: boolean;
	isUse: boolean;
	moldBomMasterId: number;
	parentId: number;
	isRoot: boolean;
	moldMasterId: number;
	moldMaster: MoldMasterDto;
	moldTypeCode: string;
	moldTypeName: string;
	parentItemCode: string;
	parentItemName: string;
	quantity: number;
	childItemCode: string;
	childItemName: string;
	num: number;
	isManage: boolean;
	leftSer: number;
	rightSer: number;
	subOrder: number;
	createdBy: string;
	createdAt: string;
	updatedBy: string;
	updatedAt: string;
}

export interface MoldBomDetailSearchResponse {
	id: number;
	tenantId: number;
	isDelete: boolean;
	parentId: number;
	isRoot: boolean;
	moldTypeCode: string;
	moldTypeName: string;
	// MoldMaster 필드들
	moldCode: string;
	moldName: string;
	moldStandard: string;
	lifeCycle: number;
	moldPrice: number;
	safeStock: number;
	manageType: string;
	keepPlace: string;
	num: number;
	isManage: boolean;
	leftSer: number;
	rightSer: number;
	subOrder: number;
	createdBy: string;
	createdAt: string;
	updatedBy: string;
	updatedAt: string;
}

export interface MoldBomMasterSearchRequest {
	id?: number;
	itemId?: number;
	progressId?: number;
	progressTypeCode?: string;
	machineId?: number;
	machineName?: string;
	createdBy?: string;
	createdAtStart?: string;
	createdAtEnd?: string;
	updatedBy?: string;
	updatedAtStart?: string;
	updatedAtEnd?: string;
}

export interface MoldBomDetailSearchRequest {
	id?: number;
	moldBomMasterId?: number;
	parentId?: number;
	isRoot?: boolean;
	moldMasterId?: number;
	isManage?: boolean;
	createdBy?: string;
	createdAtStart?: string;
	createdAtEnd?: string;
	updatedBy?: string;
	updatedAtStart?: string;
	updatedAtEnd?: string;
}

export interface MoldBomMasterCreateRequest {
	itemId: number;
	itemNo?: number;
	itemNumber?: string;
	itemName?: string;
	itemSpec?: string;
	progressId: number;
	progressTypeCode?: string;
	machineId: number;
	machineName?: string;
}

export interface MoldBomMasterUpdateRequest {
	itemId: number;
	itemNo?: number;
	itemNumber?: string;
	itemName?: string;
	itemSpec?: string;
	progressId: number;
	progressTypeCode?: string;
	machineId: number;
	machineName?: string;
}

export interface MoldBomDetailCreateRequest {
	moldBomMasterId: number;
	parentId: number;
	isRoot: boolean;
	moldMasterId: number;
	num: number;
	isManage: boolean;
	leftSer: number;
	rightSer: number;
	subOrder: number;
}

export interface MoldBomDetailUpdateRequest {
	parentId?: number;
	isRoot?: boolean;
	moldMasterId?: number;
	num?: number;
	isManage?: boolean;
	leftSer?: number;
	rightSer?: number;
	subOrder?: number;
}

export interface MoldBomMasterUpdateAllRequest {
	dataList: MoldBomMasterUpdateRequest[];
}

export interface MoldBomDetailUpdateAllRequest {
	dataList: MoldBomDetailUpdateRequest[];
}

// MoldInstance 관련 타입들 (API 응답에 맞게 업데이트)
export interface MoldInstanceDto {
	id: number;
	tenantId: number;
	isDelete: boolean;
	isUse: boolean;
	moldInstanceCode: string;
	moldMasterId: number;
	moldMaster: MoldMasterDto | null;
	moldCode: string;
	moldInstanceName: string;
	moldInstanceNumber: string;
	moldInstanceStandard: string;
	moldVendorId: number;
	isInput: boolean;
	inputCommandId: number;
	keepPlace: string;
	cost: number;
	isEnd: boolean;
	endDt: string;
	endReason: string;
	maxCount: number;
	currentCount: number;
	grade: string;
	isAutoGrade: boolean;
	currentStock: number;
	isManage: boolean;
	ownComp: number;
	moldInId: number;
	moldOrderId: number;
	excAggre: string;
	capacityNum: number;
	isSubMold: boolean;
	status: string;
	inDate: string;
	series: number;
	createdBy: string | null;
	createdAt: string | null;
	updatedBy: string | null;
	updatedAt: string | null;
	moldInoutInformations: MoldInoutInformationDto[];
	moldLocations: MoldLocationDto[];
	moldRepairs: MoldRepairDto[];
	moldSetDetails: MoldSetDetailDto[];
	moldUsingInformations: MoldUsingInformationDto[];
}

export interface MoldInstanceSearchRequest {
	inputCommandId?: number;
	moldInstanceCode?: string;
	moldCode?: string;
	moldInstanceName?: string;
	grade?: string;
	status?: string;
	isEnd?: boolean;
	moldMasterId?: number;
	page?: number;
	size?: number;
}

// MoldSetMasterSearchRequest 타입
export interface MoldSetMasterSearchRequest {
	itemId?: number;
	progressId?: number;
	moldSetCode?: string;
	moldSetName?: string;
	moldSetDate?: string;
	place?: string;
	isDefault?: boolean;
	refItemId?: number;
	refProgressId?: number;
	machineName?: string;
	isUse?: boolean;
	createdBy?: string;
	updatedBy?: string;
	createdAtStart?: string;
	createdAtEnd?: string;
	updatedAtStart?: string;
	updatedAtEnd?: string;
}

// MoldBomDetail Set Assigned Instances API Response
export interface MoldBomDetailSetAssignedInstanceDto {
	moldSetDetailId: number | null;
	moldBomDetailId: number;
	moldMasterId: number;
	moldCode: string;
	moldName: string;
	moldStandard: string;
	moldInstanceId: number | null;
	assignedMoldInstanceCode: string | null;
	assignedMoldInstanceName: string | null;
}