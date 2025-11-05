import {
	FetchApiPost,
	FetchApiGet,
	FetchApiPut,
	FetchApiDelete,
} from '@esg/utils/request';

import {
	createCompanyPayload,
	Company,
	GetSearchCompanyListPayload,
	UpdateCompanyPayload,
	GetFieldDataPayload,
} from '@esg/types/company';

export const getAllCompaniesTreeData = async () => {
	const res = await FetchApiGet('/company');
	if (res.status !== 'success') {
		throw new Error('사업장 목록 조회 실패');
	}

	// Handle new API response structure with pagination
	// New structure: { status, data: { content: [...], pageable: {...}, totalElements: number } }
	// Old structure: { status, data: [...] }
	if (res.data && res.data.content) {
		return res.data.content;
	}

	// Fallback for old structure
	return res.data;
};

export const getCompanyList = async (
	payload: import('@esg/types/company').GetAllCompanyListPayload
) => {
	const res = await FetchApiGet('/company', payload);
	if (res.status !== 'success') {
		throw new Error('사업장 목록 조회 실패');
	}
	return res.data;
};

export const createCompany = async (data: Partial<createCompanyPayload>) => {
	// snake_case 필드를 camelCase payload로 매핑
	const {
		name,
		groupId,
		license,
		companyType,
		isApproved,
		businessType,
		businessItem,
		approvedCharger,
		address,
		addressDetail,
		postcode,
		latitude,
		longitude,
		// reportPercent,
	} = data;

	const cleanedParams: createCompanyPayload = Object.fromEntries(
		Object.entries({
			name,
			license,
			companyType,
			isApproved,
			businessType,
			businessItem,
			approvedCharger,
			address,
			addressDetail,
			postcode,
			latitude,
			longitude,
			// reportPercent,
			groupId,
		}).filter(([_, v]) => v !== undefined)
	);

	const res = await FetchApiPost('/company', cleanedParams);

	if (res.status !== 'success') {
		const errorMessage = res.errorMessage || '사업장 등록 실패';
		throw new Error(errorMessage);
	}
	return res.data;
};

export const updateCompany = async (id: number, data: UpdateCompanyPayload) => {
	const {
		// isUse,
		groupId,
		childId,
		name,
		license,
		companyType,
		isApproved,
		businessType,
		businessItem,
		approvedCharger,
		address,
		addressDetail,
		postcode,
		latitude,
		longitude,
		// reportPercent,
	} = data;

	// 2) undefined인 프로퍼티 걸러내기
	const cleanedParams = Object.fromEntries(
		Object.entries({
			// isUse,
			groupId,
			childId,
			name,
			license,
			companyType,
			isApproved,
			businessType,
			businessItem,
			approvedCharger,
			address,
			addressDetail,
			postcode,
			latitude,
			longitude,
			// reportPercent,
		}).filter(([_, v]) => v !== undefined)
	);
	// return cleanedParams;
	const res = await FetchApiPut(`/company/${id}`, cleanedParams);

	if (res.status !== 'success') {
		const errorMessage = res.errorMessage || '사업장 수정 실패';
		throw new Error(errorMessage);
	}
	return res.data;
};

export const deleteCompany = async (id: number) => {
	const res = await FetchApiDelete(`/company/${id}`);
	if (res.status !== 'success') {
		const errorMessage = res.errorMessage || '사업장 삭제 실패';
		throw new Error(errorMessage);
	}
	return res.data;
};

export const getCompanyFieldValues = async (
	fieldName: string,
	payload: GetFieldDataPayload
) => {
	const res = await FetchApiPost(`/company/fields/${fieldName}`, payload);
	if (res.status !== 'success') {
		const errorMessage = res.errorMessage || '사업장 필드 조회 실패';
		throw new Error(errorMessage);
	}

	// Handle new API response structure
	if (res.data && res.data.content) {
		return res.data.content;
	}
	return res.data;
};

export const searchCompanies = async (payload: GetSearchCompanyListPayload) => {
	const res = await FetchApiGet('/init/company/search', payload);
	if (res.status !== 'success') {
		throw new Error('사업장 검색 실패');
	}

	// Handle new API response structure
	if (res.data && res.data.content) {
		return res.data.content;
	}
	return res.data;
};

export const getDetailCompany = async (id: number) => {
	if (id < 1) return false;
	const res = await FetchApiGet(`/company/${id}`);
	if (res.status !== 'success') {
		const errorMessage = res.errorMessage || '사업장 상세 조회 실패';
		throw new Error(errorMessage);
	}
	return res.data as Company;
};

export const getChildCompanyList = async (id: number) => {
	if (id < 1) return false;
	const res = await FetchApiGet(`/company/${id}/children`);
	if (res.status !== 'success') {
		throw new Error('사업장 목록 조회 실패');
	}

	// Handle new API response structure
	if (res.data && res.data.content) {
		return res.data.content;
	}
	return res.data;
};
