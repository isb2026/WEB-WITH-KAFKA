import {
	FetchApiPost,
	FetchApiGet,
	FetchApiPut,
	FetchApiDelete,
} from '@primes/utils/request';
import {
	GetAllCodeGroupListPayload,
	createCodeGroupPayload,
	CodeGroup,
	GetSearchCodeGroupListPayload,
	updateCodeGroupPayload,
} from '@primes/types/codeGroup';

export const getAllCodeGroupList = async (
	payload: GetAllCodeGroupListPayload
) => {
	const res = await FetchApiGet('/init/code-group', payload);
	if (res.status !== 'success') {
		throw new Error('코드 그룹 목록 조회 실패');
	}
	return res.data;
};

export const createCodeGroup = async (
	data: Partial<createCodeGroupPayload>
) => {
	const { solutionId, groupCode, groupName, description } = data;

	const cleanedParams = {
		solutionId,
		groupCode,
		groupName,
		description,
	};

	const res = await FetchApiPost('/init/code-group/', cleanedParams);

	if (res.status !== 'success') {
		const errorMessage = res.errorMessage || '코드 그룹 등록 실패';
		throw new Error(errorMessage);
	}
	return res.data;
};

export const updateCodeGroup = async (
	id: number,
	data: Partial<updateCodeGroupPayload>
) => {
	const { solutionName, groupCode, groupName, description, useState } = data;

	const cleanedParams = {
		solutionName,
		groupCode,
		groupName,
		description,
		useState,
	};

	const res = await FetchApiPut(`/init/code-group/${id}`, cleanedParams);

	if (res.status !== 'success') {
		const errorMessage = res.errorMessage || '코드 그룹 수정 실패';
		throw new Error(errorMessage);
	}
	return res.data;
};

export const deleteCodeGroup = async (id: number) => {
	const res = await FetchApiDelete(`/code-group/${id}`);
	if (res.status !== 'success') {
		const errorMessage = res.errorMessage || '코드 그룹 삭제 실패';
		throw new Error(errorMessage);
	}
	return res.data;
};

export const getCodeGroupFieldName = async (fieldName: string) => {
	const res = await FetchApiGet(`/init/code-group/field/${fieldName}`);
	if (res.status !== 'success') {
		const errorMessage = res.errorMessage || '코드 그룹 조회 실패';
		throw new Error(errorMessage);
	}
	return res.data;
};

export const searchCodeGroup = async (
	payload: GetSearchCodeGroupListPayload
) => {
	const res = await FetchApiGet('/init/code-group/search', payload);
	if (res.status !== 'success') {
		throw new Error('코드 그룹 검색 실패');
	}
	return res.data;
};
