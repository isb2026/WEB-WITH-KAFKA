import {
	FetchApiPost,
	FetchApiGet,
	FetchApiPut,
	FetchApiDelete,
	getSearchParams,
} from '@primes/utils/request';
import type {
	WorkingSearchRequest,
	WorkingDetailSearchRequest,
	WorkingResultRegisterRequest,
	WorkingResultRegisterResponse,
	WorkingInLotCreateRequest,
	UsingLotCreateRequest,
	WorkingBufferUpdateRequest,
} from '@primes/types/production';

// Export types for hooks
export type CreateWorkingPayload = {
	commandId?: number;
	commandNo?: string;
	workBy?: string;
	workDate?: string;
	standardTime?: number;
	shift?: string;
	startTime?: string;
	endTime?: string;
};

export type UpdateWorkingPayload = {
	workBy?: string;
	workDate?: string;
	standardTime?: number;
	shift?: string;
	endTime?: string;
};

export type CreateWorkingDetailPayload = {
	workingMasterId: number;
	workCode?: string;
	commandId?: number;
	commandNo?: string;
	lotNo?: string;
	itemId?: number;
	itemNo?: string;
	itemNumber?: string;
	itemName?: string;
	itemSpec?: string;
	progressId?: number;
	progressCode?: string;
	progressName?: string;
	machineId?: number;
	machineCode?: string;
	machineName?: string;
	lineNo?: string;
	startTime?: string;
	endTime?: string;
	workAmount?: number;
	workWeight?: number;
	workUnit?: string;
	boxAmount?: number;
	isClose?: boolean;
	isOutsourcing?: boolean;
	inOut?: string;
	outsourcingVendorId?: number;
	outsourcingVendorName?: string;
	jobType?: string;
	badStatusCode?: string;
	badReasonCode?: string;
};

export type UpdateWorkingDetailPayload = CreateWorkingDetailPayload;

export type WorkingListParams = {
	page?: number;
	size?: number;
	searchRequest?: any;
};

export type WorkingDetailListParams = {
	page?: number;
	size?: number;
	workingMasterId?: number;
	searchRequest?: any;
};

// 타입 정의는 @primes/types/production에서 import하여 사용
// (위에서 import한 타입들을 사용)

// Working Master API calls
export const getWorkingList = async (
	searchRequest: WorkingSearchRequest = {},
	page: number = 0,
	size: number = 10
) => {
	// getSearchParams 유틸리티 사용
	const searchParams = getSearchParams(searchRequest);
	const url = `/production/working?page=${page}&size=${size}&${searchParams}`;

	const res = await FetchApiGet(url);
	if (res.status !== 'success') {
		const errorMessage =
			res.errorMessage || 'Working 목록 조회 실패';
		throw new Error(errorMessage);
	}

	return res.data;
};

export const createWorking = async (data: Partial<CreateWorkingPayload>) => {
	// 허용된 필드만 추출 (cleanedParams 패턴)
	const {
		commandId,
		commandNo,
		workBy,
		workDate,
		standardTime,
		shift,
		startTime,
		endTime,
	} = data;

	const cleanedParams = {
		commandId,
		commandNo,
		workBy,
		workDate,
		standardTime: standardTime ? Number(standardTime) : undefined,
		shift,
		startTime,
		endTime,
	};

	const res = await FetchApiPost('/production/working/master', cleanedParams);
	if (res.status !== 'success') {
		const errorMessage = res.errorMessage || 'Working 생성 실패';
		throw new Error(errorMessage);
	}
	return res.data;
};

export const updateWorking = async (
	id: number,
	data: Partial<UpdateWorkingPayload>
) => {
	// 허용된 필드만 추출 (cleanedParams 패턴)
	const { workBy, workDate, standardTime, shift, endTime } = data;

	const cleanedParams = {
		workBy,
		workDate,
		standardTime: standardTime ? Number(standardTime) : undefined,
		shift,
		endTime,
	};

	const res = await FetchApiPut(
		`/production/working/master/${id}`,
		cleanedParams
	);
	if (res.status !== 'success') {
		const errorMessage = res.errorMessage || 'Working 수정 실패';
		throw new Error(errorMessage);
	}
	return res.data;
};

export const startWork = async (id: number) => {
	const res = await FetchApiPut(`/production/working/master/${id}/start`, {});
	if (res.status !== 'success') {
		const errorMessage = res.errorMessage || '작업 시작 실패';
		throw new Error(errorMessage);
	}
	return res.data;
};

export const finishWork = async (id: number) => {
	const res = await FetchApiPut(
		`/production/working/master/${id}/finish`,
		{}
	);
	if (res.status !== 'success') {
		const errorMessage = res.errorMessage || '작업 종료 실패';
		throw new Error(errorMessage);
	}
	return res.data;
};

export const deleteWorking = async (ids: number[]) => {
	const res = await FetchApiDelete('/production/working/master', {}, ids);
	if (res.status !== 'success') {
		const errorMessage = res.errorMessage || 'Working Master 삭제 실패';
		throw new Error(errorMessage);
	}
	return res.data;
};

// Working Detail 관련 타입은 위에서 이미 정의됨

// Working Detail API calls
export const getWorkingDetailList = async (
	searchRequest: any = {},
	page: number = 0,
	size: number = 10
) => {
	// searchRequest에서 허용된 필드만 추출
	const { workingMasterId, workCode, commandNo, lotNo } = searchRequest;
	const cleanedSearchRequest = {
		workingMasterId,
		workCode,
		commandNo,
		lotNo,
	};

	// getSearchParams 유틸리티 사용
	const searchParams = getSearchParams(cleanedSearchRequest || {});
	const url = `/production/working/detail?page=${page}&size=${size}&${searchParams}`;

	const res = await FetchApiGet(url);
	if (res.status !== 'success') {
		const errorMessage = res.errorMessage || 'Working 상세 목록 조회 실패';
		throw new Error(errorMessage);
	}
	return res.data;
};

export const getWorkingDetailByMasterId = async (
	masterId: number,
	page: number = 0,
	size: number = 10
) => {
	const searchRequest = { workingMasterId: masterId };

	const searchParams = getSearchParams(searchRequest);
	const url = `/production/working/detail?page=${page}&size=${size}&${searchParams}`;

	const res = await FetchApiGet(url);
	if (res.status !== 'success') {
		const errorMessage =
			res.errorMessage || `Working ID ${masterId}의 상세 목록 조회 실패`;
		throw new Error(errorMessage);
	}
	return res.data;
};

export const createWorkingDetail = async (
	data: Partial<CreateWorkingDetailPayload>
) => {
	// 허용된 필드만 추출 (cleanedParams 패턴)
	const {
		workingMasterId,
		workCode,
		commandId,
		commandNo,
		lotNo,
		itemId,
		itemNo,
		itemNumber,
		itemName,
		itemSpec,
		progressId,
		progressCode,
		progressName,
		machineId,
		machineCode,
		machineName,
		lineNo,
		startTime,
		endTime,
		workAmount,
		workWeight,
		workUnit,
		boxAmount,
		isClose,
		isOutsourcing,
		inOut,
		outsourcingVendorId,
		outsourcingVendorName,
		jobType,
		badStatusCode,
		badReasonCode,
	} = data;

	const cleanedParams = {
		workingMasterId,
		workCode,
		commandId,
		commandNo,
		lotNo,
		itemId,
		itemNo,
		itemNumber,
		itemName,
		itemSpec,
		progressCode,
		progressId,
		machineId,
		machineCode,
		machineName,
		lineNo,
		startTime,
		endTime,
		workAmount,
		workWeight,
		workUnit,
		boxAmount,
		isClose,
		isOutsourcing,
		inOut,
		outsourcingVendorId,
		outsourcingVendorName,
		jobType,
		badStatusCode,
		badReasonCode,
	};

	const res = await FetchApiPost('/production/working/detail', cleanedParams);
	if (res.status !== 'success') {
		const errorMessage = res.errorMessage || 'Working 상세 생성 실패';
		throw new Error(errorMessage);
	}
	return res.data;
};

export const updateWorkingDetail = async (
	id: number,
	data: Partial<CreateWorkingDetailPayload>
) => {
	// 허용된 필드만 추출 (cleanedParams 패턴)
	const {
		workingMasterId,
		workCode,
		commandId,
		commandNo,
		lotNo,
		itemId,
		itemNo,
		itemNumber,
		itemName,
		itemSpec,
		progressId,
		progressCode,
		progressName,
		machineId,
		machineCode,
		machineName,
		lineNo,
		startTime,
		endTime,
		workAmount,
		workWeight,
		workUnit,
		boxAmount,
		isClose,
		isOutsourcing,
		inOut,
		outsourcingVendorId,
		outsourcingVendorName,
		jobType,
		badStatusCode,
		badReasonCode,
	} = data;

	const cleanedParams = {
		workingMasterId,
		workCode,
		commandId,
		commandNo,
		lotNo,
		itemId,
		itemNo,
		itemNumber,
		itemName,
		itemSpec,
		progressId,
		progressCode,
		progressName,
		machineId,
		machineCode,
		machineName,
		lineNo,
		startTime,
		endTime,
		workAmount,
		workWeight,
		workUnit,
		boxAmount,
		isClose,
		isOutsourcing,
		inOut,
		outsourcingVendorId,
		outsourcingVendorName,
		jobType,
		badStatusCode,
		badReasonCode,
	};

	const res = await FetchApiPut(
		`/production/working/detail/${id}`,
		cleanedParams
	);
	if (res.status !== 'success') {
		const errorMessage = res.errorMessage || 'Working 상세 수정 실패';
		throw new Error(errorMessage);
	}
	return res.data;
};

export const deleteWorkingDetail = async (ids: number[]) => {
	const res = await FetchApiDelete('/production/working/detail', ids);
	if (res.status !== 'success') {
		const errorMessage = res.errorMessage || 'Working 상세 삭제 실패';
		throw new Error(errorMessage);
	}
	return res.data;
};

// ===== 새로운 작업실적 등록 API =====

// 작업실적 등록 (로트 생성 포함) - 핵심 API!
export const registerWorkingResult = async (
	data: WorkingResultRegisterRequest
): Promise<WorkingResultRegisterResponse> => {
	// cleanedParams 패턴 적용
	const {
		commandNo,
		workDate,
		workAmount,
		boxAmount,
		shift,
		workWeight,
		workUnit,
		workBy,
		machineCode,
		machineName,
		lineNo,
		usedMaterials,
	} = data;

	const cleanedParams = {
		commandNo,
		workDate,
		workAmount,
		boxAmount,
		shift,
		workWeight,
		workUnit,
		workBy,
		machineCode,
		machineName,
		lineNo,
		usedMaterials,
	};

	const res = await FetchApiPost('/production/working', cleanedParams);
	if (res.status !== 'success') {
		const errorMessage = res.errorMessage || '작업실적 등록 실패';
		throw new Error(errorMessage);
	}
	return res.data;
};

// ===== 자재 투입 관련 API =====

// 자재 투입 함수는 workingInLotService.ts로 이동됨

// 자재 투입 목록 조회 함수는 workingInLotService.ts로 이동됨

// ===== 사용량 기록 관련 API =====

// 사용량 기록 (일괄 생성)
export const createUsingLotList = async (
	data: UsingLotCreateRequest[]
): Promise<any[]> => {
	// cleanedParams 패턴 적용
	const cleanedDataArray = data.map((item) => {
		const {
			commandId,
			lotNo,
			itemId,
			itemNo,
			itemNumber,
			itemName,
			itemSpec,
			usingQty,
			workWeight,
			workUnit,
		} = item;

		return {
			commandId,
			lotNo,
			itemId,
			itemNo,
			itemNumber,
			itemName,
			itemSpec,
			usingQty,
			workWeight,
			workUnit,
		};
	});

	const res = await FetchApiPost(
		'/production/using-lot/list',
		cleanedDataArray
	);
	if (res.status !== 'success') {
		const errorMessage = res.errorMessage || '사용량 기록 실패';
		throw new Error(errorMessage);
	}
	return res.data;
};

// ===== WorkingBuffer 관련 API =====

// 자재 회수 및 WorkingBuffer 관련 함수들은 workingBufferService.ts로 이동됨
