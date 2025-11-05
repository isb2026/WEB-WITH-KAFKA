import {
	FetchApiPost,
	FetchApiGet,
	FetchApiPut,
	FetchApiDelete,
	getSearchParams,
} from '@primes/utils/request';

import type {
	CheckingHeadData,
	CreateCheckingHeadPayload,
	UpdateCheckingHeadPayload,
	CheckingHeadListParams,
} from '@primes/types/qms/checkingHead';

// 🚨 Swagger API 기반 cleanedParams 패턴
// Quality API - checking/heads 모듈 실제 필드 적용

/**
 * QMS 검사 헤드 목록 조회
 */
export const getCheckingHeadList = async (
	params: CheckingHeadListParams = {}
) => {
	const { page = 0, size = 10, searchRequest = {} } = params;
	if (searchRequest?.checkingHeadId === 0 || searchRequest?.checkingHeadId === '0') {
		return {
			content: [],
			totalElements: 0,
			totalPages: 0,
			size,
			number: page,
			numberOfElements: 0,
			first: page === 0,
			last: true,
			empty: true,
		};
	}
	const searchParams = getSearchParams(searchRequest);
	const url = `/quality/api/checking/heads?page=${page}&size=${size}&${searchParams}`;

	const res = await FetchApiGet(url);

	if (res.status !== 'success') {
		throw new Error(res.errorMessage || 'QMS 검사 헤드 목록 조회 실패');
	}

	// meta 데이터를 JSON으로 변환
	if (res.data?.content) {
		res.data.content = res.data.content.map((item: any) => ({
			...item,
			meta: item.meta ? JSON.parse(item.meta) : null
		}));
	}

	return res.data;
};

/**
 * QMS 검사 헤드 단일 조회
 */
export const getCheckingHeadById = async (id: number) => {
	const res = await FetchApiGet(`/quality/api/checking/heads/${id}`);

	if (res.status !== 'success') {
		throw new Error(res.errorMessage || 'QMS 검사 헤드 조회 실패');
	}

	// meta 데이터를 JSON으로 변환
	if (res.data?.meta) {
		res.data.meta = JSON.parse(res.data.meta);
	}

	return res.data;
};

/**
 * QMS 검사 헤드 생성 (Swagger 기반 cleanedParams 패턴)
 * 배치 생성 지원 ✅ (배열 구조)
 */
export const createCheckingHead = async (
	data: Partial<CreateCheckingHeadPayload>[]
) => {
	// Handle array of items - collect all cleanedParams first
	const cleanedParamsArray = [];
	
	for (const item of data) {
		// Swagger API 검증된 허용 키만 추출
		const {
			inspectionType,
			targetId,
			targetCode,
			checkingName,
			isPass,
			meta,
		} = item;

		const cleanedParams = {
			inspectionType,
			targetId,
			targetCode,
			checkingName,
			isPass,
			meta: typeof meta === 'object' ? JSON.stringify(meta) : meta,
		};

		cleanedParamsArray.push(cleanedParams);
	}

	// dataList로 감싸서 API 호출
	const res = await FetchApiPost('/quality/api/checking/heads', {
		dataList: cleanedParamsArray
	});

	if (res.status !== 'success') {
		throw new Error(res.errorMessage || 'QMS 검사 헤드 생성 실패');
	}

	return res.data;
};

/**
 * QMS 검사 헤드 수정 (Swagger 기반 cleanedParams 패턴)
 * 실제 API 검증된 필드: 5개
 */
export const updateCheckingHead = async (
	id: number,
	data: Partial<UpdateCheckingHeadPayload>
) => {
	// Swagger API 검증된 허용 키만 추출
	const { isUse, inspectionType, targetId, targetCode, checkingName } = data;

	const cleanedParams = {
		isUse,
		inspectionType,
		targetId,
		targetCode,
		checkingName,
	};

	const res = await FetchApiPut(`/quality/api/checking/heads/${id}`, cleanedParams);

	if (res.status !== 'success') {
		throw new Error(res.errorMessage || 'QMS 검사 헤드 수정 실패');
	}

	return res.data;
};

/**
 * QMS 검사 헤드 삭제
 */
export const deleteCheckingHead = async (ids: number[]) => {
	const res = await FetchApiDelete(`/quality/api/checking/heads`, undefined, ids);

	if (res.status !== 'success') {
		throw new Error(res.errorMessage || 'QMS 검사 헤드 삭제 실패');
	}

	return res.data;
};

/**
 * QMS 검사 헤드 검색
 */
export const searchCheckingHeads = async (searchParams: any) => {
	const res = await FetchApiPost('/quality/api/checking/heads/search', searchParams);

	if (res.status !== 'success') {
		throw new Error(res.errorMessage || 'QMS 검사 헤드 검색 실패');
	}

	return res.data;
};

/**
 * QMS 검사 헤드 Field API (Custom Select용)
 * Swagger에서 Field API 지원 확인됨 ✅
 * 엔드포인트: /api/checking/heads/fields/{fieldName}
 */
export const getCheckingHeadFields = async (params?: any) => {
	const res = await FetchApiGet('/quality/api/checking/heads/fields', params);

	if (res.status !== 'success') {
		throw new Error(res.errorMessage || 'QMS 검사 헤드 필드 조회 실패');
	}

	return res.data; // [{ id, value }] 형태
};
