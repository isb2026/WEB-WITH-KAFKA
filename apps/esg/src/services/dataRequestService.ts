import { FetchApiPost, FetchApiGet } from '@esg/utils/request';

export interface DataRequestCreatePayload {
    companyId: number;
    accountMonth: string; // YYYYMM format
    accounts: number[]; // Array of account IDs
}

// Data Request APIs
export const createBulkDataRequest = async (requests: DataRequestCreatePayload[]) => {
    const res = await FetchApiPost('/data-request', requests);
    if (res.status !== 'success') {
        throw new Error('데이터 요청 생성 실패');
    }
    return res.data;
};

export const getDataRequestsByCompanyId = async (companyId: number) => {
    const res = await FetchApiGet(`/data-request/company/${companyId}`);
    if (res.status !== 'success') {
        throw new Error('회사별 데이터 요청 조회 실패');
    }
    return res.data;
};