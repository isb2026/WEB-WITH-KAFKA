import {
	FetchApiPost,
	FetchApiGet,
	FetchApiPut,
	FetchApiDelete,
} from '@primes/utils/request';

// WorkCalendar Master API calls
export const getWorkCalendarList = async (
	searchRequest: any = {},
	page: number = 0,
	size: number = 10
) => {
	const res = await FetchApiGet('/production/work-calendar', {
		searchRequest,
		page,
		size,
	});
	if (res.status !== 'success') {
		throw new Error('WorkCalendar 목록 조회 실패');
	}
	return res.data;
};

export const createWorkCalendar = async (data: any) => {
	const res = await FetchApiPost('/production/work-calendar', data);
	if (res.status !== 'success') {
		throw new Error('WorkCalendar 생성 실패');
	}
	return res.data;
};

export const updateWorkCalendar = async (id: number, data: any) => {
	const res = await FetchApiPut(`/production/work-calendar/${id}`, data);
	if (res.status !== 'success') {
		throw new Error('WorkCalendar 수정 실패');
	}
	return res.data;
};

export const deleteWorkCalendar = async (ids: number[]) => {
	const res = await FetchApiDelete('/production/work-calendar', ids);
	if (res.status !== 'success') {
		throw new Error('WorkCalendar 삭제 실패');
	}
	return res.data;
};