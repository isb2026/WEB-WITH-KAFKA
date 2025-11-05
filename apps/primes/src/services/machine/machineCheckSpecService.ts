import {
	FetchApiGet,
	FetchApiPost,
	FetchApiPut,
	FetchApiDelete,
} from '@primes/utils/request';
import type {
	MachineCheckSpec,
	CreateMachineCheckSpecPayload,
	UpdateMachineCheckSpecPayload,
	MachineCheckSpecListParams,
	MachineCheckSpecListResponse,
	FieldOption,
} from '@primes/types/machine/machineCheckSpec';

// 기계 검사 기준 목록 조회
export const getMachineCheckSpecList = async (
	params: MachineCheckSpecListParams = {}
): Promise<MachineCheckSpecListResponse> => {
	const { page = 0, size = 30, searchRequest = {} } = params;

	const res = await FetchApiGet('/machine/machine-check-spec', {
		page,
		size,
		searchRequest,
	});

	if (res.status !== 'success') {
		throw new Error(res.errorMessage || '기계 검사 기준 목록 조회 실패');
	}

	return res.data;
};

// 기계 검사 기준 상세 조회
export const getMachineCheckSpecById = async (
	id: number
): Promise<MachineCheckSpec> => {
	const res = await FetchApiGet(`/machine/machine-check-spec/${id}`);

	if (res.status !== 'success') {
		throw new Error(res.errorMessage || '기계 검사 기준 상세 조회 실패');
	}

	return res.data;
};

// 기계 검사 기준 등록
export const createMachineCheckSpec = async (
	data: CreateMachineCheckSpecPayload
): Promise<MachineCheckSpec> => {
	// cleanedParams 패턴 적용 - 허용된 키만 추출
	const {
		machineId,
		specName,
		specType,
		standardValue,
		upperLimit,
		lowerLimit,
		unit,
		checkCycle,
		checkMethod,
		description,
		isActive,
	} = data;

	const cleanedParams = {
		machineId,
		specName,
		specType,
		standardValue,
		upperLimit,
		lowerLimit,
		unit,
		checkCycle,
		checkMethod,
		description,
		isActive,
	};

	const res = await FetchApiPost(
		'/machine/machine-check-spec',
		cleanedParams
	);

	if (res.status !== 'success') {
		throw new Error(res.errorMessage || '기계 검사 기준 등록 실패');
	}

	return res.data;
};

// 기계 검사 기준 수정
export const updateMachineCheckSpec = async (
	id: number,
	data: Partial<UpdateMachineCheckSpecPayload>
): Promise<MachineCheckSpec> => {
	// cleanedParams 패턴 적용 - 허용된 키만 추출
	const {
		machineId,
		specName,
		specType,
		standardValue,
		upperLimit,
		lowerLimit,
		unit,
		checkCycle,
		checkMethod,
		description,
		isActive,
	} = data;

	const cleanedParams = {
		machineId,
		specName,
		specType,
		standardValue,
		upperLimit,
		lowerLimit,
		unit,
		checkCycle,
		checkMethod,
		description,
		isActive,
	};

	const res = await FetchApiPut(
		`/machine/machine-check-spec/${id}`,
		cleanedParams
	);

	if (res.status !== 'success') {
		throw new Error(res.errorMessage || '기계 검사 기준 수정 실패');
	}

	return res.data;
};

// 기계 검사 기준 삭제
export const deleteMachineCheckSpec = async (id: number): Promise<void> => {
	const res = await FetchApiDelete(`/machine/machine-check-spec/${id}`);

	if (res.status !== 'success') {
		throw new Error(res.errorMessage || '기계 검사 기준 삭제 실패');
	}
};

// Field API - 기계 검사 기준 필드 조회 (Custom Select용)
export const getMachineCheckSpecFields = async (
	fieldName: string
): Promise<FieldOption[]> => {
	const res = await FetchApiGet(
		`/machine/machine-check-spec/field/${fieldName}`
	);

	if (res.status !== 'success') {
		throw new Error(res.errorMessage || '기계 검사 기준 필드 조회 실패');
	}

	return res.data;
};
