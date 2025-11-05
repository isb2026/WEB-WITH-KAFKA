import {
	FetchApiPost,
	FetchApiGet,
	FetchApiPut,
	FetchApiDelete,
	getSearchParams,
} from '@primes/utils/request';
import {
	Machine,
	CreateMachinePayload,
	UpdateMachinePayload,
	SearchMachineRequest,
} from '@primes/types/machine';

export const getMachineList = async ({
	searchRequest,
	page = 0,
	size = 10,
}: {
	searchRequest: SearchMachineRequest;
	page?: number;
	size?: number;
}) => {
	// Add 1-second delay for better UX
	await new Promise((resolve) => setTimeout(resolve, 1000));

	const searchParams = getSearchParams(searchRequest);
	const res = await FetchApiGet(
		`/machine/machine?page=${page}&size=${size}&${searchParams}`
	);
	if (res.status !== 'success') {
		const errorMessage = res.errorMessage || 'Machine 목록 조회 실패';
		throw new Error(errorMessage);
	}
	return res.data;
};

export const createMachine = async (payload: CreateMachinePayload[]) => {
	// 배열을 직접 받아서 각 항목에서 허용된 키만 추출
	const cleanedDataList = payload.map(
		(item: Partial<CreateMachinePayload>) => {
			const {
				isNotwork,
				machineCode,
				machineName,
				machineType,
				machineGrade,
				machineSpec,
				modelName,
				usingGroup,
				madeYear,
				makeComp,
				buyDate,
				buyPrice,
				motorNumber,
				mainWorker,
				subWorker,
				rph,
			} = item;

			return {
				isNotwork,
				machineCode,
				machineName,
				machineType,
				machineGrade,
				machineSpec,
				modelName,
				usingGroup,
				madeYear,
				makeComp,
				buyDate,
				buyPrice,
				motorNumber,
				mainWorker,
				subWorker,
				rph,
			};
		}
	);

	// dataList 래퍼 없이 배열을 직접 전송
	const res = await FetchApiPost('/machine/machine', cleanedDataList);
	if (res.status !== 'success') {
		const errorMessage = res.errorMessage || '설비 생성 실패';
		throw new Error(errorMessage);
	}
	return res.data;
};

export const updateMachine = async (
	id: number,
	data: Partial<UpdateMachinePayload>
) => {
	const {
		isUse,
		isNotwork,
		machineCode,
		machineName,
		machineType,
		machineGrade,
		machineSpec,
		modelName,
		usingGroup,
		makeYear,
		makeComp,
		buyDate,
		buyPrice,
		motorNumber,
		mainWorker,
		subWorker,
		rph,
	} = data;

	const cleanedParams = {
		isUse,
		isNotwork,
		machineCode,
		machineName,
		machineType,
		machineGrade,
		machineSpec,
		modelName,
		usingGroup,
		makeYear,
		makeComp,
		buyDate,
		buyPrice,
		motorNumber,
		mainWorker,
		subWorker,
		rph,
	};

	const res = await FetchApiPut(`/machine/machine/${id}`, cleanedParams);
	if (res.status !== 'success') {
		const errorMessage = res.errorMessage || '설비 수정 실패';
		throw new Error(errorMessage);
	}
	return res.data;
};

export const deleteMachine = async (ids: number[]) => {
	const res = await FetchApiDelete(`/machine/machine`, undefined, ids);
	if (res.status !== 'success') {
		throw new Error('설비 삭제 실패');
	}
	return res.data;
};

export const getMachineFieldName = async (fieldName: string) => {
	const res = await FetchApiGet(`/machine/fields/${fieldName}`);
	if (res.status !== 'success') {
		throw new Error('필드 조회 실패');
	}
	return res.data;
};
