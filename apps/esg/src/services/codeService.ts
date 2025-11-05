import { FetchApiGet, FetchApiPost, FetchApiPut, FetchApiDelete } from '@esg/utils/request';

export interface CodeCreatePayload {
    codeName: string;
    description?: string;
}

export interface CodeUpdatePayload {
    codeGroupId?: number;
    codeName?: string;
    description?: string;
    isUse?: boolean;
}

export interface CodeGroupCreatePayload {
    parentId?: number;
    groupCode: string; // max 3 characters
    groupName: string;
    description?: string;
}

export interface CodeGroupUpdatePayload {
    parentId?: number;
    groupCode?: string;
    groupName?: string;
    description?: string;
    isUse?: boolean;
}

// Code APIs
export const getCodeGroupTree = async () => {
    const res = await FetchApiGet('/code/codes');
    if (res.status !== 'success') {
        throw new Error('코드 그룹 트리 조회 실패');
    }
    return res.data;
};

export const getCodesByHierarchyPath = async (hierarchyPath: string) => {
    const res = await FetchApiGet(`/code/codes/${hierarchyPath}`);
    if (res.status !== 'success') {
        throw new Error('계층형 코드 조회 실패');
    }
    return res.data;
};

export const createCode = async (codeGroupId: number, payload: CodeCreatePayload) => {
    const res = await FetchApiPost(`/code/${codeGroupId}`, payload);
    if (res.status !== 'success') {
        throw new Error('코드 생성 실패');
    }
    return res.data;
};

export const updateCode = async (id: number, payload: CodeUpdatePayload) => {
    const res = await FetchApiPut(`/code/${id}`, payload);
    if (res.status !== 'success') {
        throw new Error('코드 수정 실패');
    }
    return res.data;
};

export const deleteCode = async (id: number) => {
    const res = await FetchApiDelete(`/code/${id}`);
    if (res.status !== 'success') {
        throw new Error('코드 삭제 실패');
    }
    return res.data;
};

// Code Group APIs
export const createCodeGroup = async (payload: CodeGroupCreatePayload) => {
    const res = await FetchApiPost('/code/group', payload);
    if (res.status !== 'success') {
        throw new Error('코드 그룹 생성 실패');
    }
    return res.data;
};

export const updateCodeGroup = async (id: number, payload: CodeGroupUpdatePayload) => {
    const res = await FetchApiPut(`/code/group/${id}`, payload);
    if (res.status !== 'success') {
        throw new Error('코드 그룹 수정 실패');
    }
    return res.data;
};

export const deleteCodeGroup = async (id: number) => {
    const res = await FetchApiDelete(`/code/group/${id}`);
    if (res.status !== 'success') {
        throw new Error('코드 그룹 삭제 실패');
    }
    return res.data;
};