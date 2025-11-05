import { group } from 'console';
import {
	FetchApiPost,
	FetchApiGet,
	FetchApiPut,
	FetchApiDelete,
} from '@esg/utils/request';

import {
	Group,
	GroupListData,
	CreateGroupPayload,
	UpdateGroupPayload,
	GroupResponse,
	GroupTreeNode,
	CompanyInTree,
	ApiResponse,
} from '@esg/types/group';

// Groups
export const getAllGroupsTreeData = async (): Promise<GroupTreeNode[]> => {
	const res = await FetchApiGet('/group/tree');
	if (res.status !== 'success' || !res.data) {
		throw new Error('그룹 트리 조회 실패');
	}
	return res.data;
};

export const getGroupList = async (
	payload: import('@esg/types/group').GetAllGroupListPayload
): Promise<GroupListData> => {
	const res = await FetchApiGet<GroupListData>('/group', payload);
	if (res.status !== 'success' || !res.data) {
		throw new Error(res.message || '그룹 목록 조회 실패');
	}
	return res.data;
};

export const createGroup = async (data: CreateGroupPayload): Promise<Group> => {
	const res = await FetchApiPost<GroupResponse>('/group', data);
	if (res.status !== 'success' || !res.data) {
		throw new Error(res.message || '그룹 생성 실패');
	}
	return res.data.data;
};

export const getGroup = async (groupId: number): Promise<Group> => {
	const res = await FetchApiGet<GroupResponse>(`/group/${groupId}`);
	if (res.status !== 'success' || !res.data) {
		throw new Error(res.message || '그룹 조회 실패');
	}
	return res.data.data;
};

export const updateGroup = async (
	groupId: number,
	data: UpdateGroupPayload
): Promise<Group> => {
	const {
		groupName,
		parentId,
		type,
		description,
		reportPercent,
		isOpenToPublic,
	} = data;

	// 2) undefined인 프로퍼티 걸러내기
	const cleanedParams = Object.fromEntries(
		Object.entries({
			groupName,
			parentId,
			type,
			description,
			reportPercent,
			isOpenToPublic,
		}).filter(([_, v]) => v !== undefined)
	);
	const res = await FetchApiPut<GroupResponse>(
		`/group/${groupId}`,
		cleanedParams
	);
	if (res.status !== 'success' || !res.data) {
		throw new Error(res.message || '그룹 수정 실패');
	}
	return res.data.data;
};

export const deleteGroup = async (id: number): Promise<void> => {
	const res = await FetchApiDelete<GroupResponse>(`/group/${id}`);
	if (res.status !== 'success') {
		throw new Error(res.message || '그룹 삭제 실패');
	}
};

export const getCompaniesByGroupId = async (groupId: number) => {
	console.log('groupId service', groupId);
	if (groupId < 1) return false;
	const res = await FetchApiGet(`/group/${groupId}/companies`);
	if (res.status !== 'success' || !res.data) {
		throw new Error(res.message || '그룹 조회 실패');
	}
	console.log('res', res);
	return res.data;
};

export const getGroupFieldValues = async (fieldName: string) => {
	const res = await FetchApiPost(`/group/fields/${fieldName}`, {});
	if (res.status !== 'success') {
		const errorMessage = res.errorMessage || '그룹 필드 조회 실패';
		throw new Error(errorMessage);
	}
	// Handle new API response structure
	if (res.data && res.data.content) {
		return res.data.content;
	}
	return res.data;
};

export const getGroupDetail = async (id: number) => {
	if (id < 1) return false;
	const res = await FetchApiGet(`/group/${id}`);
	if (res.status !== 'success') {
		const errorMessage = res.errorMessage || '그룹 상세 조회 실패';
		throw new Error(errorMessage);
	}
	return res.data;
};
