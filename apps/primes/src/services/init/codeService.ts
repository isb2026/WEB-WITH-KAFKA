import {
	FetchApiPost,
	FetchApiGet,
	FetchApiPut,
	FetchApiDelete,
} from '@primes/utils/request';
import {
	createCodePayload,
	GetSearchCodeListPayload,
	updateCodePayload,
	updateCodeGroupPayload,
	createCodeGroupPayload,
} from '@primes/types/code';

export const getAllCodeList = async () => {
	const res = await FetchApiGet('/init/codes');
	if (res.status !== 'success') {
		throw new Error('코드 목록 조회 실패');
	}
	return res.data;
};

export const createCodeGroup = async (
	data: Partial<createCodeGroupPayload>
) => {
	const { parentId, isRoot, groupCode, groupName, description } = data;

	const cleanedParams = {
		parentId,
		isRoot,
		groupCode,
		groupName,
		description,
	};

	const res = await FetchApiPost('/init/code-group', cleanedParams);

	if (res.status !== 'success') {
		const errorMessage = res.errorMessage || '코드 그룹 등록 실패';
		throw new Error(errorMessage);
	}
	return res.data;
};

export const createCode = async (data: Partial<createCodePayload>) => {
	const { codeGroupId, codeName, description } = data;

	const cleanedParams = {
		codeGroupId,
		codeName,
		description,
	};

	const res = await FetchApiPost('/init/code', cleanedParams);

	if (res.status !== 'success') {
		const errorMessage = res.errorMessage || '코드 등록 실패';
		throw new Error(errorMessage);
	}
	return res.data;
};

export const updateCode = async (
	id: number,
	data: Partial<updateCodePayload>
) => {
	const { codeGroupId, codeName, description } = data;

	const cleanedParams = {
		codeGroupId,
		codeName,
		description,
	};

	const res = await FetchApiPut(`/init/code/${id}`, cleanedParams);

	if (res.status !== 'success') {
		const errorMessage = res.errorMessage || '코드 수정 실패';
		throw new Error(errorMessage);
	}
	return res.data;
};

export const updateCodeGroup = async (
	id: number,
	data: Partial<updateCodeGroupPayload>
) => {
	const { isUse, parentId, isRoot, groupCode, groupName, description } = data;

	const cleanedParams = {
		isUse,
		parentId,
		isRoot,
		groupCode,
		groupName,
		description,
	};

	const res = await FetchApiPut(`/init/code-group/${id}`, cleanedParams);

	if (res.status !== 'success') {
		const errorMessage = res.errorMessage || '코드 그룹 수정 실패';
		throw new Error(errorMessage);
	}
	return res.data;
};

export const deleteCode = async (id: number) => {
	const res = await FetchApiDelete(`/init/code/${id}`);
	if (res.status !== 'success') {
		const errorMessage = res.errorMessage || '코드 삭제 실패';
		throw new Error(errorMessage);
	}
	return res.data;
};

export const deleteCodeGroup = async (id: number) => {
	const res = await FetchApiDelete(`/init/code-group/${id}`);
	if (res.status !== 'success') {
		const errorMessage = res.errorMessage || '코드 그룹 삭제 실패';
		throw new Error(errorMessage);
	}
	return res.data;
};

export const getCodeFieldName = async (fieldName: string) => {
	const res = await FetchApiGet(`/init/codes/${fieldName}`);
	if (res.status !== 'success') {
		const errorMessage = res.errorMessage || '코드 조회 실패';
		throw new Error(errorMessage);
	}
	return res.data;
};
