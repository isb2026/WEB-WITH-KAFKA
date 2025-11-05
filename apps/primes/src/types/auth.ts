export interface LoginPayload {
	username: string;
	password: string;
	tenantId?: string;
}

export interface RegisterRequest {
	username: string;
	password: string;
	tenantId: string | number;
	name: string;
	userEmail?: string;
	mobileTel?: string;
	homeTel?: string;
	profileImage?: string;
	departmentCode?: string;
	partLevel?: string;
	partPosition?: string;
	zipcode?: string;
	addressMaster?: string;
	addressDetail?: string;
	inDate?: string;
	outDate?: string;
	isTenantAdmin: boolean | string | number;
}
