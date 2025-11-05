import { FetchApiGet, FetchApiPost, getSearchParams } from '@esg/utils/request';
import {
	CreateDataRequestPayload,
	DataRequestListResponse,
	GetAllDataRequestListPayload,
	DataRequestItem,
} from '@esg/types/request';

// NOTE: Swagger에 따라 엔드포인트 명 확인 필요. 임시로 /data-request 사용
export const getDataRequestList = async (
	payload: GetAllDataRequestListPayload
): Promise<DataRequestListResponse | null> => {
	const { page = 0, size = 10, searchRequest } = payload;
	const { companyId } = searchRequest || {};
	if (companyId) {
		const searchParams = getSearchParams(searchRequest || {});
		const res = await FetchApiGet<DataRequestItem[]>(
			`/data-request/company/${companyId}?page=${payload.page}&size=${payload.size}&${searchParams}`
		);
		if (res.status !== 'success') {
			throw new Error(res.errorMessage || '데이터 요청 목록 조회 실패');
		}
		const response: DataRequestListResponse = {
			status: 'success',
			data: (res.data ?? []) as DataRequestItem[],
			message: null,
		};
		return response;
	} else {
		return { status: 'success', data: [], message: null };
	}
};

export const createDataRequest = async (data: CreateDataRequestPayload) => {
	const { companyId, locationId, accounts, accountMonth } = data;
	const cleanedParams = {
		companyId,
		locationId,
		accounts,
		accountMonth,
	};
	const res = await FetchApiPost('/data-request', [cleanedParams]);
	console.log('res', res);
	if (res.status !== 'success') {
		throw new Error(res.errorMessage || '데이터 요청 생성 실패');
	}
	return res.data;
};
