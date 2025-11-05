import {
	FetchApiPost,
	FetchApiGet,
	FetchApiPut,
	FetchApiDelete,
	getSearchParams
} from '@esg/utils/request';

import {
	GetAllAccountStyleListPayload,
	GetSearchAccountStyleListPayload,
	SearchAccountStyleRequest,
	AccountStyle,
	AccountStyleListResponse,
	CreateAccountStylePayload,
	UpdateAccountStylePayload,
	GetFieldDataPayload,
} from '@esg/types/accountStyle';

export const getAllAccountStyle = async (
	payload: GetAllAccountStyleListPayload
) => {
	const { page = 0, size = 10, searchRequest } = payload;
	const searchParams = getSearchParams(searchRequest || {});

	const res = await FetchApiGet(`/accountstyle?page=${page}&size=${size}&${searchParams}`);
	if (res.status !== 'success') {
		throw new Error('관리항목 목록 조회 실패');
	}
	return res.data;
};

export const getAccountStyleFieldValues = async (
	fieldName: string,
	filterPayload: GetFieldDataPayload
) => {
	const res = await FetchApiPost(
		`/accountstyle/fields/${fieldName}`,
		filterPayload
	);
	if (res.status !== 'success') {
		const errorMessage = res.errorMessage || '필드 조회 실패';
		throw new Error(errorMessage);
	}
	return res.data;
};
