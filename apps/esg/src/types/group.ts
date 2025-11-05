export interface Group {
	groupId: number;
	parentId: number | null;
	groupName: string;
	type: string;
	description: string;
	reportPercent: string;
	isOpenToPublic: boolean;
}

export interface ApiResponse<T> {
	status: string;
	data: T;
	message: string;
}

export interface CreateGroupPayload {
	groupName: string;
	parentId: number | null;
	type: string;
	description: string;
	reportPercent: string;
	isOpenToPublic: boolean;
}

export interface UpdateGroupPayload extends Partial<CreateGroupPayload> {}
export type GroupResponse = ApiResponse<Group>;

export interface GroupListData {
	content: Group[];
	totalElements: number;
	totalPages: number;
	size: number;
	number: number;
	empty: boolean;
}

export interface GroupSearchRequest {
	isUse?: boolean;
	isDelete?: boolean;
	createdAtStart?: string;
	createdAtEnd?: string;
	createdBy?: string;
	updatedAtStart?: string;
	updatedAtEnd?: string;
	updatedBy?: string;
	id?: number;
	groupName?: string;
	parentId?: number | null;
	type?: string;
}

export interface GetAllGroupListPayload {
	page: number;
	size: number;
	searchRequest?: GroupSearchRequest;
}

export interface CompanyInTree {
	isUse: boolean;
	isDelete: boolean;
	tenantId: number;
	createdAt: string;
	createdBy: string;
	updatedAt: string;
	updatedBy: string;
	id: number;
	groupId: number;
	locationId: number;
	name: string;
	license: string;
	companyType: 'COMPANY' | 'GROUP' | 'WORKPLACE';
	isApproved: boolean;
	businessType: string;
	businessItem: string;
	address: string;
	addressDetail: string;
	postcode: number;
	approvedCharger: string;
}

export interface GroupTreeNode extends Group {
	companies: CompanyInTree[];
	children: GroupTreeNode[];
	portfolio: GroupTreeNode[];
	classification: GroupTreeNode[];
}

export type GroupTreeResponse = ApiResponse<GroupTreeNode[]>;
