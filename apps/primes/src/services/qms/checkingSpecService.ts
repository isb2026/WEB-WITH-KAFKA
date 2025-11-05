import {
	FetchApiPost,
	FetchApiGet,
	FetchApiPut,
	FetchApiDelete,
	getSearchParams,
} from '@primes/utils/request';

import type {
	CheckingSpecData,
	CreateCheckingSpecPayload,
	UpdateCheckingSpecPayload,
	CheckingSpecListParams,
} from '@primes/types/qms/checkingSpec';

// 🚨 Swagger API 기반 cleanedParams 패턴
// Quality API - checking-spec 모듈 실제 필드 적용

/**
 * QMS 검사 규격 목록 조회
 */
export const getCheckingSpecList = async (
	params: CheckingSpecListParams = {}
) => {
	const { page = 0, size = 10, searchRequest = {} } = params;
	if (searchRequest.targetId === 0) {
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
	const url = `/quality/checking-spec?page=${page}&size=${size}&${searchParams}`;

	const res = await FetchApiGet(url);

	if (res.status !== 'success') {
		throw new Error(res.errorMessage || 'QMS 검사 규격 목록 조회 실패');
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
 * QMS 검사 규격 단일 조회
 */
export const getCheckingSpecById = async (id: number) => {
	const res = await FetchApiGet(`/quality/checking-spec/${id}`);

	if (res.status !== 'success') {
		throw new Error(res.errorMessage || 'QMS 검사 규격 조회 실패');
	}

	// meta 데이터를 JSON으로 변환
	if (res.data?.meta) {
		res.data.meta = res.data.meta ? JSON.parse(res.data.meta) : null;
	}

	return res.data;
};

/**
 * QMS 검사 규격 생성 (Swagger 기반 cleanedParams 패턴)
 * 실제 API 검증된 필드: 12개
 */
export const createCheckingSpec = async (
	data: Partial<CreateCheckingSpecPayload>[]
) => {
	// Handle array of items - collect all cleanedParams first
	const cleanedParamsArray = [];

	for (const item of data) {
		// Swagger API 검증된 허용 키만 추출
		const {
			inspectionType,
			specType,
			checkingFormulaId,
			checkingName,
			orderNo,
			standard,
			standardUnit,
			checkPeriod,
			sampleQuantity,
			targetId,
			targetCode,
			meta,
			formula,
		} = item;

		const cleanedParams: any = {
			inspectionType,
			specType,
			checkingFormulaId,
			checkingName,
			orderNo,
			standard,
			standardUnit,
			checkPeriod,
			sampleQuantity,
			targetId,
			targetCode,
			meta: typeof meta === 'object' ? JSON.stringify(meta) : meta,
		};

		// meta 데이터가 있을 때만 포함
		if (formula !== undefined && formula !== null && formula !== '') {
			cleanedParams.formula = formula;
		}

		cleanedParamsArray.push(cleanedParams);
	}

	// API를 한 번만 호출하여 모든 데이터를 전송
	const res = await FetchApiPost(
		'/quality/checking-spec',
		cleanedParamsArray
	);

	if (res.status !== 'success') {
		throw new Error(res.errorMessage || 'QMS 검사 규격 생성 실패');
	}

	return res.data;
};

/**
 * QMS 검사 규격 수정 (Swagger 기반 cleanedParams 패턴)
 * 실제 API 검증된 필드: 13개
 */
export const updateCheckingSpec = async (
	id: number,
	data: Partial<UpdateCheckingSpecPayload>
) => {
	// Swagger API 검증된 허용 키만 추출
	const {
		isUse,
		inspectionType,
		checkingFormulaId,
		checkingName,
		orderNo,
		standard,
		standardUnit,
		checkPeriod,
		sampleQuantity,
		targetId,
		targetCode,
		// 추가 필드들 (Swagger 분석에서 "및 3개 더"로 표시됨)
		meta,
		formula,
	} = data;

	const cleanedParams: any = {
		isUse,
		inspectionType,
		checkingFormulaId,
		checkingName,
		orderNo,
		standard,
		standardUnit,
		checkPeriod,
		sampleQuantity,
		targetId,
		targetCode,
		formula,
	};

	// meta 데이터가 있을 때만 포함
	if (meta !== undefined && meta !== null) {
		cleanedParams.meta = meta;
	}

	const res = await FetchApiPut(
		`/quality/checking-spec/${id}`,
		cleanedParams
	);

	if (res.status !== 'success') {
		throw new Error(res.errorMessage || 'QMS 검사 규격 수정 실패');
	}

	return res.data;
};

/**
 * QMS 검사 규격 삭제
 */
export const deleteCheckingSpec = async (ids: number[]) => {
	const res = await FetchApiDelete(`/quality/checking-spec`, undefined, ids);

	if (res.status !== 'success') {
		throw new Error(res.errorMessage || 'QMS 검사 규격 삭제 실패');
	}

	return res.data;
};

/**
 * QMS 검사 규격 Field API (Custom Select용)
 * Swagger에서 Field API 지원 확인됨 ✅
 */
export const getCheckingSpecFields = async (params?: any) => {
	const res = await FetchApiGet('/quality/checking-spec/fields', params);

	if (res.status !== 'success') {
		throw new Error(res.errorMessage || 'QMS 검사 규격 필드 조회 실패');
	}

	return res.data; // [{ id, value }] 형태
};

/**
 * QMS 검사 규격 Field API by Field Name (Custom Select용)
 */
export const getCheckingSpecFieldName = async (fieldName: string) => {
	const res = await FetchApiGet(`/quality/checking-spec/fields/${fieldName}`);

	if (res.status !== 'success') {
		throw new Error(res.errorMessage || 'QMS 검사 규격 필드 조회 실패');
	}

	return res.data; // [{ id, value }] 형태
};
