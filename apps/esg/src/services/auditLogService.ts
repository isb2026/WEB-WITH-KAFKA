import { FetchApiGet, FetchApiPost, FetchApiDelete } from '@esg/utils/request';

export interface AuditLogCreatePayload {
    auditLogId?: number;
    tenantId?: number;
    userId: string;
    action: string;
    targetTable: string;
    targetId: string;
    dataBefore?: string;
    dataAfter?: string;
    ipAddress?: string;
    userAgent?: string;
}

// Audit Log APIs
export const getAllAuditLogs = async (page: number = 0, size: number = 10) => {
    const res = await FetchApiGet(`/audit-log?page=${page}&size=${size}`);
    if (res.status !== 'success') {
        throw new Error('감사 로그 전체 조회 실패');
    }
    return res.data;
};

export const getAuditLogById = async (id: number) => {
    const res = await FetchApiGet(`/audit-log/${id}`);
    if (res.status !== 'success') {
        throw new Error('감사 로그 상세 조회 실패');
    }
    return res.data;
};

export const getAuditLogsByUserId = async (userId: string, page: number = 0, size: number = 10) => {
    const res = await FetchApiGet(`/audit-log/user/${userId}?page=${page}&size=${size}`);
    if (res.status !== 'success') {
        throw new Error('사용자별 감사 로그 조회 실패');
    }
    return res.data;
};

export const getAuditLogsByTable = async (targetTable: string, page: number = 0, size: number = 10) => {
    const res = await FetchApiGet(`/audit-log/table/${targetTable}?page=${page}&size=${size}`);
    if (res.status !== 'success') {
        throw new Error('테이블별 감사 로그 조회 실패');
    }
    return res.data;
};

export const getAuditLogsByTargetId = async (targetTable: string, targetId: string, page: number = 0, size: number = 10) => {
    const res = await FetchApiGet(`/audit-log/table/${targetTable}/id/${targetId}?page=${page}&size=${size}`);
    if (res.status !== 'success') {
        throw new Error('특정 대상 ID의 감사 로그 조회 실패');
    }
    return res.data;
};

export const getAuditLogsByIpAddress = async (ipAddress: string, page: number = 0, size: number = 10) => {
    const res = await FetchApiGet(`/audit-log/ip/${ipAddress}?page=${page}&size=${size}`);
    if (res.status !== 'success') {
        throw new Error('IP 주소별 감사 로그 조회 실패');
    }
    return res.data;
};

export const getAuditLogsByAction = async (action: string, page: number = 0, size: number = 10) => {
    const res = await FetchApiGet(`/audit-log/action/${action}?page=${page}&size=${size}`);
    if (res.status !== 'success') {
        throw new Error('액션별 감사 로그 조회 실패');
    }
    return res.data;
};

export const getAuditLogsByDateRange = async (
    startDate: string,
    endDate: string,
    page: number = 0,
    size: number = 10
) => {
    const res = await FetchApiGet(`/audit-log/date-range?startDate=${startDate}&endDate=${endDate}&page=${page}&size=${size}`);
    if (res.status !== 'success') {
        throw new Error('기간별 감사 로그 조회 실패');
    }
    return res.data;
};

export const searchAuditLogs = async (params: {
    userId?: string;
    action?: string;
    targetTable?: string;
    startDate?: string;
    endDate?: string;
    page?: number;
    size?: number;
}) => {
    const queryParams = new URLSearchParams();
    Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined) {
            queryParams.append(key, value.toString());
        }
    });

    const res = await FetchApiGet(`/audit-log/search?${queryParams.toString()}`);
    if (res.status !== 'success') {
        throw new Error('복합 조건 감사 로그 조회 실패');
    }
    return res.data;
};

export const createAuditLog = async (payload: AuditLogCreatePayload) => {
    const res = await FetchApiPost('/audit-log', payload);
    if (res.status !== 'success') {
        throw new Error('감사 로그 생성 실패');
    }
    return res.data;
};

export const deleteAuditLog = async (id: number) => {
    const res = await FetchApiDelete(`/audit-log/${id}`);
    if (res.status !== 'success') {
        throw new Error('감사 로그 삭제 실패');
    }
    return res.data;
};

export const cleanupOldAuditLogs = async (beforeDate: string) => {
    const res = await FetchApiDelete(`/audit-log/cleanup?beforeDate=${beforeDate}`);
    if (res.status !== 'success') {
        throw new Error('오래된 감사 로그 일괄 삭제 실패');
    }
    return res.data;
};

// Record Account별 감사 로그 조회 (새로운 API 엔드포인트)
export const getRecordAuditLogsByAccountId = async (accountId: string | number, page: number = 0, size: number = 10) => {
    const apiUrl = `/audit-log/record/account/${accountId}?page=${page}&size=${size}`;
    console.log('🚀 API Call:', apiUrl);

    try {
        const res = await FetchApiGet(apiUrl);
        console.log('✅ API Response:', res);

        if (res.status !== 'success') {
            const errorMessage = res.errorMessage || res.message || '관리항목별 감사 로그 조회 실패';
            console.error('❌ API Error:', errorMessage);
            throw new Error(errorMessage);
        }

        return res.data;
    } catch (error) {
        console.error('❌ API Exception:', error);
        throw error;
    }
};