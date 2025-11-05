import {
	FetchApiPost,
	FetchApiGet,
	FetchApiPut,
	FetchApiDelete,
	getSearchParams,
} from '@primes/utils/request';
import { 
	FileLinkDto, 
	FileLinkCreateRequest, 
	FileLinkUpdateRequest, 
	FileLinkSearchRequest 
} from '@primes/types/fileUrl';

// FileLink 목록 조회
export const getFileLinkList = async (
	searchRequest: FileLinkSearchRequest = {},
	page: number = 0,
	size: number = 10
): Promise<{ status: string; data: { content: FileLinkDto[]; totalElements: number }; message: string }> => {
	const searchParams = getSearchParams(searchRequest);
	const url = `init/filelink?page=${page}&size=${size}&${searchParams}`;

	const res = await FetchApiGet(url);
	
	if (res.status !== 'success') {
		throw new Error('FileLink 목록 조회 실패');
	}
	return res.data;
};

// FileLink 생성
export const createFileLink = async (data: FileLinkCreateRequest): Promise<FileLinkDto> => {
	const res = await FetchApiPost('init/filelink', data);
	
	if (res.status !== 'success') {
		throw new Error('FileLink 생성 실패');
	}
	return res.data;
};

// FileLink 수정
export const updateFileLink = async (id: number, data: FileLinkUpdateRequest): Promise<FileLinkDto> => {
	const res = await FetchApiPut(`init/filelink/${id}`, data);
	
	if (res.status !== 'success') {
		throw new Error('FileLink 수정 실패');
	}
	return res.data;
};

// FileLink 삭제 (단일)
export const deleteFileLink = async (id: number): Promise<void> => {
	const res = await FetchApiDelete('/init/filelink', undefined, [id]);
	
	if (res.status !== 'success') {
		throw new Error('FileLink 삭제 실패');
	}
};

// FileLink 삭제 (다중)
export const deleteFileLinks = async (ids: number[]): Promise<void> => {
	const res = await FetchApiDelete('/init/filelink', undefined, ids);
	
	if (res.status !== 'success') {
		throw new Error('FileLink 삭제 실패');
	}
};

// FileLink 상세 조회
export const getFileLinkById = async (id: number): Promise<FileLinkDto> => {
	const res = await FetchApiGet(`init/filelink/${id}`);
	
	if (res.status !== 'success') {
		throw new Error('FileLink 상세 조회 실패');
	}
	return res.data;
};