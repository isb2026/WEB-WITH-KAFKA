import {
	FetchApiPost,
	FetchApiGet,
	FetchApiPut,
	FetchApiDelete,
	getSearchParams,
} from '@primes/utils/request';
import type {
	CommandProgressSearchRequest,
	CommandProgressCreateRequest,
	CommandProgressUpdateRequest,
	CommonResponseCommandProgressDto,
	CommonResponseListCommandProgressDto,
	CommonResponsePageCommandProgressSearchResponse,
} from '@primes/types/production/commandProgressTypes';

const BASE_URL = '/production/command-progress';

// CommandProgress 목록 조회
export const getCommandProgressList = async (
	searchRequest: CommandProgressSearchRequest = {},
	page: number = 0,
	size: number = 10
): Promise<CommonResponsePageCommandProgressSearchResponse> => {
	// getSearchParams 유틸리티 사용
	const searchParams = getSearchParams(searchRequest || {});
	const url = `${BASE_URL}?page=${page}&size=${size}&${searchParams}`;

	const res = await FetchApiGet(url);
	if (res.status !== 'success') {
		const errorMessage = res.errorMessage || 'CommandProgress 목록 조회 실패';
		throw new Error(errorMessage);
	}
	return res as CommonResponsePageCommandProgressSearchResponse;
};

// CommandProgress 단일 조회
export const getCommandProgress = async (id: number): Promise<CommonResponseCommandProgressDto> => {
	const url = `${BASE_URL}/${id}`;
	
	const res = await FetchApiGet(url);
	if (res.status !== 'success') {
		const errorMessage = res.errorMessage || 'CommandProgress 조회 실패';
		throw new Error(errorMessage);
	}
	return res as CommonResponseCommandProgressDto;
};

// CommandProgress 생성
export const createCommandProgress = async (
	data: CommandProgressCreateRequest[]
): Promise<CommonResponseListCommandProgressDto> => {
	const res = await FetchApiPost(BASE_URL, data);
	if (res.status !== 'success') {
		const errorMessage = res.errorMessage || 'CommandProgress 생성 실패';
		throw new Error(errorMessage);
	}
	return res as CommonResponseListCommandProgressDto;
};

// CommandProgress 수정
export const updateCommandProgress = async (
	id: number,
	data: CommandProgressUpdateRequest
): Promise<CommonResponseCommandProgressDto> => {
	const url = `${BASE_URL}/${id}`;
	
	const res = await FetchApiPut(url, data);
	if (res.status !== 'success') {
		const errorMessage = res.errorMessage || 'CommandProgress 수정 실패';
		throw new Error(errorMessage);
	}
	return res as CommonResponseCommandProgressDto;
};

// CommandProgress 삭제
export const deleteCommandProgress = async (ids: number[]): Promise<void> => {
	const res = await FetchApiDelete(BASE_URL, ids);
	if (res.status !== 'success') {
		const errorMessage = res.errorMessage || 'CommandProgress 삭제 실패';
		throw new Error(errorMessage);
	}
}; 