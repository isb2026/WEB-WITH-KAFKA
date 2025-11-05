import {
	FetchApiPost,
	FetchApiGet,
	FetchApiPut,
	FetchApiDelete,
} from '@esg/utils/request';

import {
	BlockPayload,
	BlockResponse,
	CreateReportPayload,
	CreateTabPayload,
	CreateTabResponse,
	Report,
	UpdateTabData,
	UpdateTabPayload,
	UpdateTabResponse,
} from '@esg/types/report';

// REPORTS

export const getReportList = async (page: number, size: number) => {
	const res = await FetchApiGet('/report', { page, size });
	if (res.status !== 'success') {
		throw new Error('보고서 목록 조회 실패');
	}

	return res.data;
};

export const createReport = async (data: CreateReportPayload) => {
	const payload = {
		...data,
	};

	const res = await FetchApiPost<Report>('/report', payload);
	if (res.status !== 'success') {
		throw new Error(res.errorMessage || 'Failed to create report');
	}
	return res.data;
};

export const getReport = async (reportId: number): Promise<Report> => {
	const res = await FetchApiGet<Report>(`/report/${reportId}`);

	if (res.status !== 'success' || !res.data) {
		throw new Error(res.errorMessage || 'Failed to fetch report');
	}

	return res.data;
};

export const updateReport = async (
	reportId: number,
	data: Partial<Report>
): Promise<Report> => {
	const res = await FetchApiPut<Report>(`/report/${reportId}`, data);

	if (res.status !== 'success' || !res.data) {
		throw new Error(res.errorMessage || 'Failed to update report');
	}

	return res.data;
};

export const deleteReport = async (id: number) => {
	const res = await FetchApiDelete(`/report/${id}`);
	if (res.status !== 'success') {
		throw new Error(res.errorMessage || 'Failed to delete report');
	}
	return res.data;
};

// REPORT TABS

export const createReportTab = async (
	reportId: number,
	data: CreateTabPayload
) => {
	const payload = {
		...data,
	};

	const res = await FetchApiPost<CreateTabResponse>(
		`/report/${reportId}/tab`,
		payload
	);

	if (res.status !== 'success') {
		throw new Error(res.errorMessage || 'Failed to create tab');
	}

	return res.data;
};

export const updateReportTab = async (
	reportId: number,
	tabId: number,
	data: UpdateTabPayload
): Promise<UpdateTabData> => {
	const res = await FetchApiPut<UpdateTabResponse>(
		`/report/${reportId}/${tabId}`,
		data
	);
	if (res.status !== 'success' || !res.data) {
		throw new Error(res.errorMessage || 'Failed to update tab');
	}
	return res.data.data;
};

export const deleteReportTab = async (tabId: number, reportId: number) => {
	const res = await FetchApiDelete(`/report/${reportId}/${tabId}`);
	if (res.status !== 'success') {
		throw new Error(res.errorMessage || 'Failed to delete tab');
	}
	return res.data;
};

// REPORT TAB BLOCKS
export const updateReportTabBlock = async (
	reportId: number,
	tabId: number,
	payload: BlockPayload
) => {
	const res = await FetchApiPut<BlockResponse>(
		`/report/${reportId}/${tabId}/blocks`,
		payload
	);

	if (res.status !== 'success' || !res.data) {
		throw new Error(res.errorMessage || 'Failed to create block');
	}

	return res.data;
};
