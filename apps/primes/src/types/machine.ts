import { Pageable, Sort } from '@primes/types/common';

export interface SearchMachineRequest {
	updateBy?: string;
	machineType?: string;
	machineSpec?: string;
	buyPrice?: number;
	rph?: number;
	makeYear?: number;
	createAt?: string;
	machineGrade?: string;
	machineName?: string;
	createBy?: string;
	modelName?: string;
	machineCode?: string;
	isNotwork?: boolean;
	buyDate?: string;
	isDelete?: boolean;
	mainWorker?: string;
	usingGroup?: string;
	id?: number;
	updateAt?: string;
	makeComp?: string;
	isUse?: boolean;
	motorNumber?: number;
	subWorker?: string;
}
export interface GetAllMachineListPayload {
	page: number;
	size: number;
	searchRequest?: SearchMachineRequest;
}

export interface MachineListResponse {
	totalElements: number;
	totalPages: number;
	size: number;
	content: Machine[];
	number: number;
	sort: Sort;
	numberOfElements: number;
	pageable: Pageable;
	first: boolean;
	last: boolean;
	empty: boolean;
}

export interface UpdateMachinePayload {
	isUse?: boolean;
	isNotwork?: boolean;
	machineCode: string;
	machineName?: string;
	machineType?: string;
	machineGrade?: string;
	machineSpec?: string;
	modelName?: string;
	usingGroup?: string;
	makeYear?: number;
	makeComp?: string;
	buyDate?: string;
	buyPrice?: number;
	motorNumber?: number;
	mainWorker?: string;
	subWorker?: string;
	rph?: number;
}

export interface Machine {
	isUse: number;
	isDelete: boolean;
	createAt: string;
	createBy: string;
	updateAt: string;
	updateBy: string;
	tenantId: number;
	id: number;
	isNotwork: number;
	machineCode: string;
	machineName: string;
	machineType: string;
	machineTypeValue?: string;
	machineGrade: string;
	machineSpec: string;
	modelName: string;
	usingGroup: string;
	usingGroupValue?: string;
	madeYear: number;
	madeBy: string;
	buyDate: string;
	buyPrice: number;
	motorNumber: number;
	mainWorker: string;
	subWorker: string;
	rph: number;
}

export interface CreateMachinePayload {
	isNotwork?: boolean | null;
	isUse?: boolean | null;
	machineCode?: string | null;
	machineName?: string | null;
	machineType?: string | null;
	machineGrade?: string | null;
	machineSpec?: string | null;
	modelName?: string | null;
	usingGroup?: string | null;
	madeYear?: number | null;
	makeComp?: string | null;
	madeBy?: string | null;
	buyDate?: string | null;
	buyPrice?: number | null;
	motorNumber?: number | null;
	mainWorker?: string | null;
	subWorker?: string | null;
	rph?: number | null;
}

export interface CreateMachineDataList {
	dataList: CreateMachinePayload[];
}

export interface GetSearchMachineListPayload {
	page: number;
	size: number;
	searchRequest?: SearchMachineRequest;
}

// Machine Part 관련 타입 정의
export interface MachinePart {
	id: number;
	isUse?: boolean;
	partName?: string;
	partStandard?: string;
	partGrade?: string;
	optimum?: string;
	realStock?: number;
	machineId?: number;
	machineName?: string;
	storeName?: string;
	storeTel?: string;
	productionTime?: string;
	cost?: number;
	keepPlace?: string;
	etc?: string;
}

export interface CreateMachinePartPayload {
	partName: string;
	partStandard: string;
	partGrade?: string;
	optimum: string;
	realStock: number;
	machineId?: number;
	storeName?: string;
	storeTel?: string;
	productionTime?: string;
	cost?: number;
	keepPlace?: string;
	etc?: string;
}

export interface UpdateMachinePartPayload {
	partName: string;
	partStandard: string;
	partGrade?: string;
	optimum: string;
	realStock: number;
	machineId?: number;
	storeName?: string;
	storeTel?: string;
	productionTime?: string;
	cost?: number;
	keepPlace?: string;
	etc?: string;
}

export interface SearchMachinePartRequest {
	partCode?: string;
	partName?: string;
	partType?: string;
	machineId?: number;
	machineName?: string;
	manufacturer?: string;
	supplier?: string;
	isActive?: boolean;
}

export interface GetSearchMachinePartListPayload {
	page: number;
	size: number;
	searchRequest?: SearchMachinePartRequest;
}

export interface CreateMachinePartDataList {
	dataList: CreateMachinePartPayload[];
}

export interface MachinePartOrder {
	id: number;
	orderCode?: string;
	orderDate?: string;
	machinePartId: number;
	partName?: string;
	partStandard?: string;
	number: number;
	vendorId: number;
	vendorCode?: string;
	vendorName?: string;
	isEnd: boolean;
	isDelete?: boolean;
}

export interface CreateMachinePartOrderPayload {
	orderCode?: string;
	orderDate?: string;
	machinePartId: number;
	number: number;
	vendorId: number;
	vendorCode?: string;
	vendorName?: string;
	isEnd?: boolean;
}

export interface UpdateMachinePartOrderPayload {
	orderCode?: string;
	orderDate?: string;
	machinePartId?: number;
	number?: number;
	vendorId?: number;
	vendorCode?: string;
	vendorName?: string;
	isEnd?: boolean;
}

export interface SearchMachinePartOrderRequest {
	orderCode?: string;
	orderDate?: string;
	partName?: string;
	vendorName?: string;
	isEnd?: boolean;
	isDelete?: boolean;
}

export interface GetSearchMachinePartOrderListPayload {
	page: number;
	size: number;
	searchRequest?: SearchMachinePartOrderRequest;
}

export interface MachinePartOrderListResponse {
	totalElements: number;
	totalPages: number;
	size: number;
	content: MachinePartOrder[];
	number: number;
	sort: Sort;
	numberOfElements: number;
	pageable: Pageable;
	first: boolean;
	last: boolean;
	empty: boolean;
}

export interface GetAllMachinePartOrderListPayload {
	page: number;
	size: number;
	searchRequest?: SearchMachinePartOrderRequest;
}

export interface MachinePartOrderIn {
	id: number;
	isDelete?: boolean;
	machinePartId: number;
	partName?: string;
	machinePartOrderId: number;
	orderCode?: string;
	inDate: string;
	vendorId: number;
	vendorCode?: string;
	vendorName?: string;
	inNum: number;
	inPrice: number;
	inAmount?: number;
}

export interface CreateMachinePartOrderInPayload {
	inDate: string;
	machinePartId: number;
	machinePartOrderId: number;
	vendorId: number;
	vendorCode?: string;
	vendorName?: string;
	inNum: number;
	inPrice: number;
}

export interface UpdateMachinePartOrderInPayload {
	inDate: string;
	machinePartId: number;
	machinePartOrderId: number;
	vendorId: number;
	vendorCode?: string;
	vendorName?: string;
	inNum: number;
	inPrice: number;
}

export interface SearchMachinePartOrderInRequest {
	inDate: string;
	machinePartId: number;
	machinePartOrderId: number;
	vendorId: number;
	vendorCode?: string;
	vendorName?: string;
	inNum: number;
	inPrice: number;
}

export interface GetSearchMachinePartOrderInListPayload {
	page: number;
	size: number;
	searchRequest?: SearchMachinePartOrderInRequest;
}

export interface MachinePartOrderInListResponse {
	totalElements: number;
	totalPages: number;
	size: number;
	content: MachinePartOrder[];
	number: number;
	sort: Sort;
	numberOfElements: number;
	pageable: Pageable;
	first: boolean;
	last: boolean;
	empty: boolean;
}

export interface GetAllMachinePartOrderInListPayload {
	page: number;
	size: number;
	searchRequest?: SearchMachinePartOrderInRequest;
}

export interface MachineRepair {
	id: number;
	subject: string;
	repairPart: string;
	repairCost: number;
	description: string;
	repairStartDt: string;
	repairEndDt: string;
	brokenAt: string;
	machineId: number;
	machinePartId: number;
	partAmount: number;
	machineVendorId: number;
	machineVendorName: string;
	repairVendorId: number;
	repairVendorName: string;
	repairWorker: string;
	repairVendorTel: string;
	isClose: boolean;
	closeName: string;
	closeAt: string;
	isAdmit: boolean;
	admitName: string;
	admitAt: string;
	createdAt?: string;
	updatedAt?: string;
}

export interface CreateMachineRepairPayload {
	subject?: string;
	repairPart?: string;
	repairCost?: number;
	description?: string;
	repairStartDt?: string;
	repairEndDt?: string;
	brokenAt?: string;
	machineId?: number;
	machinePartId?: number;
	partAmount?: number;
	machineVendorId?: number;
	machineVendorName?: string;
	repairVendorId?: number;
	repairVendorName?: string;
	repairWorker?: string;
	repairVendorTel?: string;
	isClose?: boolean;
	closeName?: string;
	closeAt?: string;
	isAdmit?: boolean;
	admitName?: string;
	admitAt?: string;
}

export interface UpdateMachineRepairPayload
	extends Partial<CreateMachineRepairPayload> {
	id: number;
}

export interface MachineRepairListParams {
	page?: number;
	size?: number;
	searchRequest?: Record<string, unknown>;
}

export interface MachineRepairListResponse {
	content: MachineRepair[];
	totalElements: number;
	totalPages: number;
	size: number;
	number: number;
}

export interface SearchMachineRepairRequest {
	subject?: string;
	repairPart?: string;
	repairCost?: number;
	description?: string;
	repairStartDt?: string;
	repairEndDt?: string;
	brokenAt?: string;
	machineId?: number;
	partAmount?: number;
	machinePartId?: number;
	machineVendorId?: number;
	machineVendorName?: string;
	repairVendorId?: number;
	repairVendorName?: string;
	repairWorker?: string;
	repairVendorTel?: string;
	isClose?: boolean;
	closeName?: string;
	closeAt?: string;
	isAdmit?: boolean;
	admitName?: string;
	admitAt?: string;
}

export interface MachinePartUseInfo {
	id: number;
	machineId: number;
	machinePartId: number;
	machineRepairId: number;
	useDate?: string;
	useStock?: number;
	createdAt?: string;
	updatedAt?: string;
}

export interface CreateMachinePartUseInfoPayload {
	machineId?: number;
	machinePartId?: number;
	machineRepairId?: number;
	useDate?: string;
	useStock?: number;
}

export interface UpdateMachinePartUseInfoPayload
	extends Partial<CreateMachinePartUseInfoPayload> {
	id: number;
}

export interface MachinePartUseInfoListParams {
	page?: number;
	size?: number;
	searchRequest?: Record<string, unknown>;
}

export interface MachinePartUseInfoListResponse {
	content: MachinePartUseInfo[];
	totalElements: number;
	totalPages: number;
	size: number;
	number: number;
}

export interface SearchMachinePartUseInfoRequest {
	machineId?: number;
	machinePartId?: number;
	machineRepairId?: number;
	useDate?: string;
	useStock?: number;
}

export interface MachinePartRelation {
	id: number;
	isDelete: boolean;
	isUse: boolean;
	machineId: number;
	machineCode?: string;
	machineSpec?: string;
	machinePartId: number;
	machinePartName?: string;
	machinePartSpec?: string;
	createdAt?: string;
	updatedAt?: string;
}

export interface CreateMachinePartRelationPayload {
	isUse?: boolean;
	machineId?: number;
	machinePartId?: number;
}

export interface UpdateMachinePartRelationPayload
	extends Partial<CreateMachinePartRelationPayload> {
	id: number;
}

export interface MachinePartRelationListParams {
	page?: number;
	size?: number;
	searchRequest?: Record<string, unknown>;
}

export interface MachinePartRelationListResponse {
	content: MachinePartRelation[];
	totalElements: number;
	totalPages: number;
	size: number;
	number: number;
}

export interface SearchMachinePartRelationRequest {
	isUse?: boolean;
	machineId?: number;
	machinePartId?: number;
}