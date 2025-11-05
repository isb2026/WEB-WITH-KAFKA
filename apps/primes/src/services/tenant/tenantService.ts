import { FetchApiGet, FetchApiPost } from '@primes/utils/request';

export interface TenantInfo {
	id: number;
	tenantName: string;
	tenantImage?: string;
	companyLicense: string; // companyNumber -> companyLicense로 변경
	managerName: string;
	managerEmail: string;
	managerPhone: string;
	status: string;
	plan: string;
	startDate: string;
	endDate: string;
	maxUsers: number;
	currentUsers: number;
	storageLimitMb: number;
}

export interface TenantListResponse {
	content: TenantInfo[];
	totalElements: number;
	totalPages: number;
	size: number;
	number: number;
	first: boolean;
	last: boolean;
	numberOfElements: number;
}

// API 호출 중복 방지를 위한 캐시
const apiCallCache = new Map<string, Promise<any>>();

// 테넌트 목록 조회 (GET /tenant)
export const getTenantList = async ({
	id,
	page = 0,
	size = 10,
}: {
	id?: number;
	page?: number;
	size?: number;
}) => {
	// 캐시 키 생성
	const cacheKey = `tenant_${id}_${page}_${size}`;
	
	// 이미 같은 요청이 진행 중이면 기존 Promise 반환
	if (apiCallCache.has(cacheKey)) {
		return apiCallCache.get(cacheKey);
	}

	// 쿼리 파라미터 구성
	const params: Record<string, any> = {
		page: page.toString(),
		size: size.toString(),
	};
	
	if (id) {
		params.id = id.toString();
	}

	const apiPromise = FetchApiGet('/tenant/', params).then((response) => {
		if (response.status !== 'success') {
			throw new Error(response.errorMessage || '테넌트 목록 조회 실패');
		}
		return response;
	}).finally(() => {
		// API 호출 완료 후 캐시에서 제거
		apiCallCache.delete(cacheKey);
	});

	// 진행 중인 요청을 캐시에 저장
	apiCallCache.set(cacheKey, apiPromise);
	
	return apiPromise;
};

// 특정 테넌트 정보 조회 (ID로 조회)
export const getTenantById = async (tenantId: number) => {
	const res = await getTenantList({ id: tenantId, page: 0, size: 1 });
	
	// API 응답 구조에 맞게 수정: data.content 배열에서 테넌트 정보 추출
	if (res.data && res.data.content && res.data.content.length > 0) {
		return res.data.content[0];
	}
	
	throw new Error('테넌트를 찾을 수 없습니다');
};

// 테넌트 생성 (POST /tenant)
export const createTenant = async (tenantData: {
	tenantName: string;
	tenantImage?: string; // 회사 로고 이미지
	companyLicense: string; // companyNumber -> companyLicense로 변경
	managerName: string;
	managerEmail: string;
	managerPhone: string;
	status: string;
	plan: string;
	startDate: string;
	endDate: string;
	maxUsers: number;
	currentUsers: number;
	storageLimitMb: number;
}) => {
	const res = await FetchApiPost('/tenant/', tenantData);
	if (res.status !== 'success') {
		throw new Error(res.errorMessage || '테넌트 생성 실패');
	}
	return res.data;
};
