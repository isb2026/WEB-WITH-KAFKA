export type DataRequestStatus =
	| 'REQUESTED'
	| 'COMPLETED'
	| 'REJECTED'
	| 'CANCELLED';

export interface DataRequestSearchRequest {
	isUse?: boolean;
	isDelete?: boolean;
	createdAtStart?: string;
	createdAtEnd?: string;
	createdBy?: string;
	updatedAtStart?: string;
	updatedAtEnd?: string;
	updatedBy?: string;
	id?: number;
	companyId?: number;
	locationId?: number;
	accountId?: number;
	status?: DataRequestStatus;
	yearMonth?: string; // YYYY-MM
}

export interface GetAllDataRequestListPayload {
	page: number;
	size: number;
	searchRequest?: DataRequestSearchRequest;
}

export interface DataRequestItem {
	id: number;
	company: {
		isUse: boolean;
		isDelete: boolean;
		tenantId: number;
		createdAt: string;
		createdBy: string;
		updatedAt: string;
		updatedBy: string;
		id: number;
		groupId: number | null;
		locationId: number | null;
		name: string;
		license: string | null;
		companyType: string;
		isApproved: boolean;
		businessType: string | null;
		businessItem: string | null;
		address: string | null;
		addressDetail: string | null;
		postcode: number | null;
		approvedCharger: string;
		group: any | null;
		location: any | null;
	};
	account: {
		isUse: boolean;
		isDelete: boolean;
		tenantId: number;
		createdAt: string;
		createdBy: string;
		updatedAt: string;
		updatedBy: string;
		id: number;
		accountStyleId: number;
		meterId: number | null;
		companyId: number;
		chargerId: number;
		name: string;
		supplier: string | null;
		accountStyle: any | null;
		meter: any | null;
		company: any | null;
		charger: any | null;
	};
	actorUserId: number;
	targetUserId: number;
	accountMonth: string; // YYYYMM
	status: DataRequestStatus;
	createdAt: string;
}

export interface CreateDataRequestPayload {
	companyId: number;
	locationId?: number | null;
	accounts: number[];
	accountMonth: string; // YYYYMM
}

export interface DataRequestListResponse {
	status: 'success' | 'fail' | string;
	data: DataRequestItem[];
	message: string | null;
}
