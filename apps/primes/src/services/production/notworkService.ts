/**
 * Notwork Service - Swagger 기반 완전 재구성
 * API: /notwork/master, /notwork/detail
 * cleanedParams 패턴 적용, Batch Create 지원
 */

import {
	FetchApiPost,
	FetchApiGet,
	FetchApiPut,
	FetchApiDelete,
	getSearchParams,
} from '@primes/utils/request';
import {
	NotworkMaster,
	NotworkDetail,
	CreateNotworkMasterPayload,
	CreateNotworkDetailPayload,
	UpdateNotworkMasterPayload,
	UpdateNotworkDetailPayload,
	NotworkMasterSearchParams,
	NotworkDetailSearchParams,
	NotworkMasterListResponse,
	NotworkDetailListResponse,
	CreateNotworkMasterBatchPayload,
	CreateNotworkDetailBatchPayload,
	NotworkFieldOption,
} from '@primes/types/production/notwork';

// ============== MASTER API ==============

/**
 * 비가동 Master 목록 조회
 */
export const getNotworkMasterList = async (
	searchRequest: NotworkMasterSearchParams = {},
	page: number = 0,
	size: number = 10
): Promise<NotworkMasterListResponse> => {
	// cleanedParams 패턴: 허용된 검색 필드만 추출
	const {
		workDate,
		machineId,
		machineCode,
		machineName,
		jobType,
		startDate,
		endDate,
	} = searchRequest;

	const cleanedSearchRequest = {
		workDate,
		machineId,
		machineCode,
		machineName,
		jobType,
		startDate,
		endDate,
	};

	const searchParams = getSearchParams(cleanedSearchRequest);
	const url = `/production/notwork/master?page=${page}&size=${size}&${searchParams}`;

	const res = await FetchApiGet(url);
	if (res.status !== 'success') {
		const errorMessage = res.errorMessage || '비가동 Master 목록 조회 실패';
		throw new Error(errorMessage);
	}
	return res.data;
};

/**
 * 비가동 Master 개별 조회
 */
export const getNotworkMasterById = async (
	id: number
): Promise<NotworkMaster> => {
	const res = await FetchApiGet(`/production/notwork/master/${id}`);
	if (res.status !== 'success') {
		const errorMessage = res.errorMessage || '비가동 Master 조회 실패';
		throw new Error(errorMessage);
	}
	return res.data;
};

/**
 * 비가동 Master 생성 (단일)
 */
export const createNotworkMaster = async (
	data: Partial<CreateNotworkMasterPayload>
) => {
	// cleanedParams 패턴: Swagger 분석 기반 허용 필드만 추출
	const {
		workDate,
		machineId,
		machineCode,
		machineName,
		jobType,
		totalNotworkMinute,
		description,
	} = data;

	const cleanedParams = {
		workDate,
		machineId,
		machineCode,
		machineName,
		jobType,
		totalNotworkMinute,
		description,
	};

	const res = await FetchApiPost('/production/notwork/master', cleanedParams);
	if (res.status !== 'success') {
		const errorMessage = res.errorMessage || '비가동 Master 등록 실패';
		throw new Error(errorMessage);
	}
	return res.data;
};

/**
 * 비가동 Master 생성 (배치) - Swagger 지원 확인됨
 */
export const createNotworkMasterBatch = async (
	data: CreateNotworkMasterBatchPayload
) => {
	// Batch 생성 시에도 각 항목에 cleanedParams 적용
	const cleanedDataList = data.dataList.map((item) => {
		const {
			workDate,
			machineId,
			machineCode,
			machineName,
			jobType,
			totalNotworkMinute,
			description,
		} = item;

		return {
			workDate,
			machineId,
			machineCode,
			machineName,
			jobType,
			totalNotworkMinute,
			description,
		};
	});

	const cleanedParams = { dataList: cleanedDataList };

	const res = await FetchApiPost('/production/notwork/master', cleanedParams);
	if (res.status !== 'success') {
		const errorMessage = res.errorMessage || '비가동 Master 배치 등록 실패';
		throw new Error(errorMessage);
	}
	return res.data;
};

/**
 * 비가동 Master 수정
 */
export const updateNotworkMaster = async (
	id: number,
	data: Partial<UpdateNotworkMasterPayload>
) => {
	// cleanedParams 패턴: Swagger PUT 분석 기반
	const {
		workDate,
		machineId,
		machineCode,
		machineName,
		jobType,
		totalNotworkMinute,
		description,
	} = data;

	const cleanedParams = {
		workDate,
		machineId,
		machineCode,
		machineName,
		jobType,
		totalNotworkMinute,
		description,
	};

	const res = await FetchApiPut(
		`/production/notwork/master/${id}`,
		cleanedParams
	);
	if (res.status !== 'success') {
		const errorMessage = res.errorMessage || '비가동 Master 수정 실패';
		throw new Error(errorMessage);
	}
	return res.data;
};

/**
 * 비가동 Master 삭제 (배치)
 */
export const deleteNotworkMaster = async (ids: number[]) => {
	const res = await FetchApiDelete('/production/notwork/master', {
		dataList: ids,
	});
	if (res.status !== 'success') {
		const errorMessage = res.errorMessage || '비가동 Master 삭제 실패';
		throw new Error(errorMessage);
	}
	return res.data;
};

// ============== DETAIL API ==============

/**
 * 비가동 Detail 목록 조회
 */
export const getNotworkDetailList = async (
	searchRequest: NotworkDetailSearchParams = {},
	page: number = 0,
	size: number = 10
): Promise<NotworkDetailListResponse> => {
	// cleanedParams 패턴: 허용된 검색 필드만 추출
	const {
		notworkMasterId,
		workCode,
		commandNo,
		notworkCode,
		notworkReasonCode,
		worker,
		startTime,
		endTime,
		itemNo,
		progressNo,
	} = searchRequest;

	const cleanedSearchRequest = {
		notworkMasterId,
		workCode,
		commandNo,
		notworkCode,
		notworkReasonCode,
		worker,
		startTime,
		endTime,
		itemNo,
		progressNo,
	};

	const searchParams = getSearchParams(cleanedSearchRequest);
	const url = `/production/notwork/detail?page=${page}&size=${size}&${searchParams}`;

	const res = await FetchApiGet(url);
	if (res.status !== 'success') {
		const errorMessage = res.errorMessage || '비가동 Detail 목록 조회 실패';
		throw new Error(errorMessage);
	}
	return res.data;
};

/**
 * 비가동 Detail 마스터별 조회 (Master-Detail 패턴)
 */
export const getNotworkDetailByMasterId = async (
	masterId: number,
	page: number = 0,
	size: number = 10
): Promise<NotworkDetailListResponse> => {
	const url = `/production/notwork/detail?notworkMasterId=${masterId}&page=${page}&size=${size}`;

	const res = await FetchApiGet(url);
	if (res.status !== 'success') {
		const errorMessage =
			res.errorMessage || '비가동 Detail 마스터별 조회 실패';
		throw new Error(errorMessage);
	}
	return res.data;
};

/**
 * 비가동 Detail 개별 조회
 */
export const getNotworkDetailById = async (
	id: number
): Promise<NotworkDetail> => {
	const res = await FetchApiGet(`/production/notwork/detail/${id}`);
	if (res.status !== 'success') {
		const errorMessage = res.errorMessage || '비가동 Detail 조회 실패';
		throw new Error(errorMessage);
	}
	return res.data;
};

/**
 * 비가동 Detail 생성 (단일)
 */
export const createNotworkDetail = async (
	data: Partial<CreateNotworkDetailPayload>
) => {
	// cleanedParams 패턴: Swagger create_fields 기반
	const {
		notworkMasterId,
		itemNo,
		progressNo,
		commandNo,
		workCode,
		notworkMinute,
		startTime,
		endTime,
		notworkCode,
		notworkName,
		notworkReasonCode,
		notworkReasonName,
		contents,
		worker,
	} = data;

	const cleanedParams = {
		notworkMasterId,
		itemNo,
		progressNo,
		commandNo,
		workCode,
		notworkMinute,
		startTime,
		endTime,
		notworkCode,
		notworkName,
		notworkReasonCode,
		notworkReasonName,
		contents,
		worker,
	};

	const res = await FetchApiPost('/production/notwork/detail', cleanedParams);
	if (res.status !== 'success') {
		const errorMessage = res.errorMessage || '비가동 Detail 등록 실패';
		throw new Error(errorMessage);
	}
	return res.data;
};

/**
 * 비가동 Detail 생성 (배치) - Swagger 지원 확인됨
 */
export const createNotworkDetailBatch = async (
	data: CreateNotworkDetailBatchPayload
) => {
	// Batch 생성 시에도 각 항목에 cleanedParams 적용
	const cleanedDataList = data.dataList.map((item) => {
		const {
			notworkMasterId,
			itemNo,
			progressNo,
			commandNo,
			workCode,
			notworkMinute,
			startTime,
			endTime,
			notworkCode,
			notworkName,
			notworkReasonCode,
			notworkReasonName,
			contents,
			worker,
		} = item;

		return {
			notworkMasterId,
			itemNo,
			progressNo,
			commandNo,
			workCode,
			notworkMinute,
			startTime,
			endTime,
			notworkCode,
			notworkName,
			notworkReasonCode,
			notworkReasonName,
			contents,
			worker,
		};
	});

	const cleanedParams = { dataList: cleanedDataList };

	const res = await FetchApiPost('/production/notwork/detail', cleanedParams);
	if (res.status !== 'success') {
		const errorMessage = res.errorMessage || '비가동 Detail 배치 등록 실패';
		throw new Error(errorMessage);
	}
	return res.data;
};

/**
 * 비가동 Detail 수정
 */
export const updateNotworkDetail = async (
	id: number,
	data: Partial<UpdateNotworkDetailPayload>
) => {
	// cleanedParams 패턴: Swagger update_fields 기반
	const {
		notworkMasterId,
		itemNo,
		progressNo,
		commandNo,
		workCode,
		notworkMinute,
		startTime,
		endTime,
		notworkCode,
		notworkName,
		notworkReasonCode,
		notworkReasonName,
		contents,
		worker,
	} = data;

	const cleanedParams = {
		notworkMasterId,
		itemNo,
		progressNo,
		commandNo,
		workCode,
		notworkMinute,
		startTime,
		endTime,
		notworkCode,
		notworkName,
		notworkReasonCode,
		notworkReasonName,
		contents,
		worker,
	};

	const res = await FetchApiPut(
		`/production/notwork/detail/${id}`,
		cleanedParams
	);
	if (res.status !== 'success') {
		const errorMessage = res.errorMessage || '비가동 Detail 수정 실패';
		throw new Error(errorMessage);
	}
	return res.data;
};

/**
 * 비가동 Detail 삭제 (배치)
 */
export const deleteNotworkDetail = async (ids: number[]) => {
	const res = await FetchApiDelete('/production/notwork/detail', {
		dataList: ids,
	});
	if (res.status !== 'success') {
		const errorMessage = res.errorMessage || '비가동 Detail 삭제 실패';
		throw new Error(errorMessage);
	}
	return res.data;
};

// ============== FIELD API ==============

/**
 * 비가동 Master Field API
 */
export const getNotworkMasterFields = async (
	fieldName: string
): Promise<NotworkFieldOption[]> => {
	const res = await FetchApiGet(
		`/production/notwork/master/fields/${fieldName}`
	);
	if (res.status !== 'success') {
		const errorMessage = res.errorMessage || '비가동 Master 필드 조회 실패';
		throw new Error(errorMessage);
	}
	return res.data;
};

/**
 * 비가동 Detail Field API
 */
export const getNotworkDetailFields = async (
	fieldName: string
): Promise<NotworkFieldOption[]> => {
	const res = await FetchApiGet(
		`/production/notwork/detail/fields/${fieldName}`
	);
	if (res.status !== 'success') {
		const errorMessage = res.errorMessage || '비가동 Detail 필드 조회 실패';
		throw new Error(errorMessage);
	}
	return res.data;
};

// ============== 추가 유틸리티 함수 ==============

/**
 * 비가동 Master와 연관된 Detail 목록 조회 (유틸리티)
 */
export const getNotworkMasterWithDetails = async (
	masterId: number,
	detailParams?: { page?: number; size?: number }
): Promise<{ master: NotworkMaster; details: NotworkDetailListResponse }> => {
	const masterPromise = getNotworkMasterById(masterId);
	const detailsPromise = getNotworkDetailByMasterId(
		masterId,
		detailParams?.page || 0,
		detailParams?.size || 10
	);

	const [master, details] = await Promise.all([
		masterPromise,
		detailsPromise,
	]);

	return { master, details };
};
