import {
	FetchApiPost,
	FetchApiGet,
	FetchApiPut,
	FetchApiDelete,
} from '@primes/utils/request';
import {
	ProgressMachineSearchRequest,
	ProgressMachineCreateRequest,
	ProgressMachineUpdateRequest,
	ProgressMachineDto,
} from '@primes/types/progressMachine';

// ProgressMachine 조회 (GET /progress-machine)
export const getProgressMachineList = async ({
	searchRequest,
	page = 0,
	size = 10,
}: {
	searchRequest: ProgressMachineSearchRequest;
	page?: number;
	size?: number;
}) => {
	// searchRequest 객체를 URL 파라미터로 풀어서 전달
	const params = {
		page,
		size,
		...searchRequest, // searchRequest의 모든 속성을 직접 파라미터로 풀어서 전달
	};

	const res = await FetchApiGet('/machine/progress-machine', params);
	if (res.status !== 'success') {
		throw new Error(res.errorMessage || 'ProgressMachine 목록 조회 실패');
	}
	return res.data;
};

// ProgressMachine 생성 (POST /progress-machine) - 배열로 일괄 생성
export const createProgressMachine = async (
	dataList: ProgressMachineCreateRequest[]
) => {
	const res = await FetchApiPost('/machine/progress-machine', dataList);
	if (res.status !== 'success') {
		throw new Error(res.errorMessage || 'ProgressMachine 생성 실패');
	}
	return res.data;
};

// ProgressMachine 수정 (PUT /progress-machine/{id})
export const updateProgressMachine = async (
	id: number,
	data: ProgressMachineUpdateRequest
) => {
	const res = await FetchApiPut(`/machine/progress-machine/${id}`, data);
	if (res.status !== 'success') {
		throw new Error(res.errorMessage || 'ProgressMachine 수정 실패');
	}
	return res.data;
};

// ProgressMachine 삭제 (DELETE /progress-machine) - 배열로 일괄 삭제
export const deleteProgressMachine = async (ids: number[]) => {
	const res = await FetchApiDelete(
		'/machine/progress-machine',
		undefined,
		ids
	);
	if (res.status !== 'success') {
		throw new Error(res.errorMessage || 'ProgressMachine 삭제 실패');
	}
	return res.data;
};
