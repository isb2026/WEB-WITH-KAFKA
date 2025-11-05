import { FetchApiGet } from '@esg/utils/request';

export interface EmissionRequestParams {
    scope?: string;
    groupId?: string;
    companyId?: string;
    workplaceId?: string;
    year?: number;
    month?: string;
}

export interface EmissionResponse {
    data: any;
    status: string;
    message?: string;
}

export const getEmissions = async (params: EmissionRequestParams): Promise<EmissionResponse> => {
    const queryParams = new URLSearchParams();

    Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
            queryParams.append(key, value.toString());
        }
    });

    const res = await FetchApiGet(`/emissions?${queryParams.toString()}`);

    if (res.status !== 'success') {
        throw new Error(res.message || '배출량 데이터 조회 실패');
    }

    return {
        data: res.data || res,
        status: res.status || 'success',
        message: res.message
    };
};