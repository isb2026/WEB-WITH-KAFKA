import {
	FetchApiPost,
	FetchApiGet,
	FetchApiPut,
	FetchApiDelete,
	getSearchParams,
} from '@primes/utils/request';

import type {
	CheckingSampleData,
	CreateCheckingSamplePayload,
	UpdateCheckingSamplePayload,
	CheckingSampleListParams,
} from '@primes/types/qms/checkingSample';

// 🚨 Swagger API 기반 cleanedParams 패턴
// Quality API - api 모듈 실제 필드 적용

/**
 * QMS 검사 샘플 목록 조회
 */
export const getCheckingSampleList = async (
	params: CheckingSampleListParams = {}
) => {
	const { page = 0, size = 10, searchRequest = {} } = params;
	
	// checkingHeadId가 null인 경우 early return으로 블로킹
	if (searchRequest.checkingHeadId == null) {
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
	const url = `/quality/api/checking/samples?page=${page}&size=${size}&${searchParams}`;

	const res = await FetchApiGet(url);

	if (res.status !== 'success') {
		throw new Error(res.errorMessage || 'QMS 검사 샘플 목록 조회 실패');
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
 * QMS 검사 샘플 단일 조회
 */
export const getCheckingSampleById = async (id: number) => {
	const res = await FetchApiGet(`/quality/api/checking/samples/${id}`);

	if (res.status !== 'success') {
		throw new Error(res.errorMessage || 'QMS 검사 샘플 조회 실패');
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
 * QMS 검사 샘플 생성 (Swagger 기반 cleanedParams 패턴)
 * 실제 API 검증된 필드: 9개
 */
export const createCheckingSample = async (
	data: Partial<CreateCheckingSamplePayload>[]
) => {
	// Handle array of items - collect all cleanedParams first
	const cleanedParamsArray = [];
	
	for (const item of data) {
		// Swagger API 검증된 허용 키만 추출
		const {
			checkingHeadId,
			sampleIndex,
			measuredValue,
			measureUnit,
			isPass,
			checkingName,
			orderNo,
			standard,
			standardUnit,
			meta
		} = item;

		const cleanedParams = {
			checkingHeadId,
			sampleIndex,
			measuredValue,
			measureUnit,
			isPass,
			checkingName,
			orderNo,
			standard,
			standardUnit,
			meta: typeof meta === 'object' ? JSON.stringify(meta) : meta,
		};

		cleanedParamsArray.push(cleanedParams);
	}

	// dataList로 감싸서 API 호출
	const res = await FetchApiPost('/quality/api/checking/samples', {
		dataList: cleanedParamsArray
	});

	if (res.status !== 'success') {
		throw new Error(res.errorMessage || 'QMS 검사 샘플 생성 실패');
	}

	return res.data;
};

/**
 * QMS 검사 샘플 수정 (Swagger 기반 cleanedParams 패턴)
 * 실제 API 검증된 필드: 9개
 */
export const updateCheckingSample = async (
	id: number,
	data: Partial<UpdateCheckingSamplePayload>
) => {
	// Swagger API 검증된 허용 키만 추출
	const {
		isUse,
		inspectionType,
		targetId,
		targetCode,
		checkingName,
		isPass,
		checkingFormulaId,
		formula,
		meta,
	} = data;

	const cleanedParams = {
		isUse,
		inspectionType,
		targetId,
		targetCode,
		checkingName,
		isPass,
		checkingFormulaId,
		formula,
		meta: typeof meta === 'object' ? JSON.stringify(meta) : meta,
	};

	const res = await FetchApiPut(`/quality/api/checking/samples/${id}`, cleanedParams);

	if (res.status !== 'success') {
		throw new Error(res.errorMessage || 'QMS 검사 샘플 수정 실패');
	}

	return res.data;
};

/**
 * QMS 검사 샘플 삭제
 */
export const deleteCheckingSample = async (id: number) => {
	const res = await FetchApiDelete(`/quality/api/checking/samples/${id}`);

	if (res.status !== 'success') {
		throw new Error(res.errorMessage || 'QMS 검사 샘플 삭제 실패');
	}

	return res.data;
};

/**
 * QMS 검사 샘플 Field API (Custom Select용)
 * Swagger에서 Field API 지원 확인됨 ✅
 */
export const getCheckingSampleFields = async (params?: any) => {
	const res = await FetchApiGet('/quality/api/checking/samples/fields', params);

	if (res.status !== 'success') {
		throw new Error(res.errorMessage || 'QMS 검사 샘플 필드 조회 실패');
	}

	return res.data; // [{ id, value }] 형태
};
